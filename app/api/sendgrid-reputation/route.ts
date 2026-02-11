import { NextResponse } from 'next/server'

type SendGridStatsResponse = Array<{
  stats?: Array<{
    metrics?: {
      delivered?: number
      bounces?: number
      blocks?: number
      spam_reports?: number
    }
  }>
}>

const getDateRange = (days: number) => {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - days)
  const toDate = (value: Date) => value.toISOString().slice(0, 10)
  return { startDate: toDate(start), endDate: toDate(end) }
}

export async function GET() {
  const apiKey = process.env.SENDGRID_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: 'SENDGRID_API_KEY is required' },
      { status: 400 }
    )
  }

  const { startDate, endDate } = getDateRange(7)
  const url = `https://api.sendgrid.com/v3/stats?start_date=${startDate}&end_date=${endDate}&aggregated_by=day`

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const body = await response.text()
      return NextResponse.json(
        { success: false, error: 'Failed to fetch SendGrid stats', details: body },
        { status: response.status }
      )
    }

    const data = (await response.json()) as SendGridStatsResponse
    const totals = data.reduce(
      (acc, item) => {
        const metrics = item.stats?.[0]?.metrics || {}
        acc.delivered += metrics.delivered || 0
        acc.bounces += metrics.bounces || 0
        acc.blocks += metrics.blocks || 0
        acc.spamReports += metrics.spam_reports || 0
        return acc
      },
      { delivered: 0, bounces: 0, blocks: 0, spamReports: 0 }
    )

    const totalEvents =
      totals.delivered + totals.bounces + totals.blocks + totals.spamReports
    const score =
      totalEvents > 0 ? Math.round((totals.delivered / totalEvents) * 100) : null

    return NextResponse.json({
      success: true,
      data: {
        startDate,
        endDate,
        score,
        totals: {
          delivered: totals.delivered,
          bounces: totals.bounces,
          blocks: totals.blocks,
          spamReports: totals.spamReports,
          totalEvents
        }
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Error fetching SendGrid stats', details: error.message },
      { status: 500 }
    )
  }
}
