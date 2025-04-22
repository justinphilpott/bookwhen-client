import { http, HttpResponse } from 'msw'
import singleEvent from '../events/success/single-event.json' with { type: 'json' }
import multipleEvents from '../events/success/multiple-events.json' with { type: 'json' }
import invalidIdError from '../events/errors/400-invalid-id.json' with { type: 'json' }

export const eventHandlers = [
  http.get('https://api.bookwhen.com/v2/events/:id', ({ params }) => {
    if (params.id === 'invalid') {
      return HttpResponse.json(invalidIdError, { status: 400 })
    }
    return HttpResponse.json(singleEvent)
  }),
  http.get('https://api.bookwhen.com/v2/events', ({ request }) => {
    const url = new URL(request.url)
    const include = url.searchParams.get('include')
    const filters = {
      from: url.searchParams.get('filter[from]'),
      to: url.searchParams.get('filter[to]'),
      tag: url.searchParams.get('filter[tag]')
    }
    return HttpResponse.json(multipleEvents)
  })
]
