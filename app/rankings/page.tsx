'use client'

import { AppLayout } from '@/components/app-layout'
import { AppHeader } from '@/components/app-header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Search } from 'lucide-react'

const keywords = [
  {
    keyword: 'roofing contractor austin',
    position: 3,
    previousPosition: 5,
    searchVolume: '2,400',
    difficulty: 'Medium',
  },
  {
    keyword: 'roof repair near me',
    position: 7,
    previousPosition: 9,
    searchVolume: '8,100',
    difficulty: 'High',
  },
  {
    keyword: 'storm damage roof repair',
    position: 2,
    previousPosition: 2,
    searchVolume: '1,600',
    difficulty: 'Medium',
  },
  {
    keyword: 'commercial roofing services',
    position: 12,
    previousPosition: 8,
    searchVolume: '1,900',
    difficulty: 'High',
  },
  {
    keyword: 'residential roofing company',
    position: 5,
    previousPosition: 7,
    searchVolume: '3,200',
    difficulty: 'Medium',
  },
  {
    keyword: 'emergency roof repair',
    position: 4,
    previousPosition: 6,
    searchVolume: '2,700',
    difficulty: 'Low',
  },
]

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Low':
      return 'default'
    case 'Medium':
      return 'secondary'
    case 'High':
      return 'destructive'
    default:
      return 'secondary'
  }
}

export default function RankingsPage() {
  return (
    <AppLayout>
      <AppHeader title="Rankings" />
      <div className="p-6">
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid gap-6 sm:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Position</p>
                    <p className="mt-2 text-3xl font-bold">5.5</p>
                    <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>Improved 2 positions</span>
                    </div>
                  </div>
                  <Search className="h-5 w-5 text-accent" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div>
                  <p className="text-sm text-muted-foreground">Keywords Tracked</p>
                  <p className="mt-2 text-3xl font-bold">{keywords.length}</p>
                  <p className="mt-2 text-xs text-muted-foreground">Active monitoring</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div>
                  <p className="text-sm text-muted-foreground">Top 10 Rankings</p>
                  <p className="mt-2 text-3xl font-bold">
                    {keywords.filter((k) => k.position <= 10).length}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    of {keywords.length} keywords
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Keywords List */}
          <Card>
            <CardHeader>
              <CardTitle>Keyword Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border">
                {keywords.map((item, index) => {
                  const improved = item.position < item.previousPosition
                  const declined = item.position > item.previousPosition
                  const positionChange = Math.abs(item.position - item.previousPosition)

                  return (
                    <div key={index} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted font-bold">
                        {item.position}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 font-semibold text-foreground">{item.keyword}</div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span>{item.searchVolume} searches/mo</span>
                          <Badge variant={getDifficultyColor(item.difficulty)} className="text-xs">
                            {item.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="shrink-0">
                        {improved && (
                          <div className="flex items-center gap-1 text-sm text-green-600">
                            <TrendingUp className="h-4 w-4" />
                            <span className="hidden sm:inline">+{positionChange}</span>
                          </div>
                        )}
                        {declined && (
                          <div className="flex items-center gap-1 text-sm text-red-600">
                            <TrendingDown className="h-4 w-4" />
                            <span className="hidden sm:inline">-{positionChange}</span>
                          </div>
                        )}
                        {!improved && !declined && (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
