import { google, calendar_v3 } from 'googleapis'
import { getPrimaryTokens, getValidAccessToken } from './admin-storage'

export interface CreateEventData {
  summary: string
  description?: string
  location?: string
  startDateTime: string
  endDateTime: string
  attendeeEmails?: string[]
}

export interface CreatedEvent {
  eventId: string
  calendarId: string
  htmlLink: string
}

/**
 * Initialise le client Calendar avec un access_token frais.
 */
async function getCalendarClient() {
  const tokens = await getPrimaryTokens()
  if (!tokens) {
    throw new Error('Aucun compte Google Calendar connecté. Allez sur /admin/google pour autoriser.')
  }

  const accessToken = await getValidAccessToken(tokens.googleEmail)

  const auth = new google.auth.OAuth2()
  auth.setCredentials({ access_token: accessToken })

  return google.calendar({ version: 'v3', auth })
}

/**
 * Crée un événement dans le calendrier du tech.
 */
export async function createEvent(
  technicienEmail: string,
  data: CreateEventData
): Promise<CreatedEvent> {
  const calendar = await getCalendarClient()

  const requestBody: calendar_v3.Schema$Event = {
    summary: data.summary,
    description: data.description,
    location: data.location,
    start: {
      dateTime: data.startDateTime,
      timeZone: 'Europe/Paris',
    },
    end: {
      dateTime: data.endDateTime,
      timeZone: 'Europe/Paris',
    },
  }

  if (data.attendeeEmails && data.attendeeEmails.length > 0) {
    requestBody.attendees = data.attendeeEmails.map((email) => ({ email }))
  }

  try {
    const response = await calendar.events.insert({
      calendarId: technicienEmail,
      requestBody,
      sendUpdates: 'none',
    })

    const event = response.data
    if (!event.id) {
      throw new Error('Création réussie mais ID manquant.')
    }

    return {
      eventId: event.id,
      calendarId: technicienEmail,
      htmlLink: event.htmlLink ?? '',
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[createEvent] Erreur pour ${technicienEmail}:`, message)
    throw new Error(`Impossible de créer l'événement Google Calendar : ${message}`)
  }
}

/**
 * Supprime un événement du calendrier d'un tech.
 */
export async function deleteEvent(
  technicienEmail: string,
  eventId: string
): Promise<void> {
  const calendar = await getCalendarClient()

  try {
    await calendar.events.delete({
      calendarId: technicienEmail,
      eventId,
      sendUpdates: 'none',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    if (message.includes('410') || message.includes('404')) {
      console.warn(`[deleteEvent] Événement ${eventId} déjà supprimé.`)
      return
    }

    console.error(`[deleteEvent] Erreur:`, message)
    throw new Error(`Impossible de supprimer l'événement : ${message}`)
  }
}

export interface BusySlot {
  start: Date
  end: Date
}

/**
 * Récupère les périodes d'occupation d'un tech sur une plage de temps.
 */
export async function getFreeBusy(
  technicienEmail: string,
  timeMin: Date,
  timeMax: Date
): Promise<BusySlot[]> {
  const calendar = await getCalendarClient()

  try {
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        timeZone: 'Europe/Paris',
        items: [{ id: technicienEmail }],
      },
    })

    const busy = response.data.calendars?.[technicienEmail]?.busy ?? []

    return busy.map((slot) => ({
      start: new Date(slot.start!),
      end: new Date(slot.end!),
    }))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[getFreeBusy] Erreur pour ${technicienEmail}:`, message)
    return []
  }
}
