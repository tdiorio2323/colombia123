import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Users, Trophy } from 'lucide-react'

const leaderboardData = [
  { rank: 1, user: 'FanaticFrenzy', points: 12500 },
  { rank: 2, user: 'DevotedDragon', points: 11800 },
  { rank: 3, user: 'LoyalLion', points: 11200 },
  { rank: 4, user: 'PassionatePhoenix', points: 10500 },
  { rank: 5, user: 'ArdentAngel', points: 9800 },
  { rank: 6, user: 'SuperfanSquad', points: 9200 },
  { rank: 7, user: 'EagerEagle', points: 8600 },
  { rank: 8, user: 'ObsessedOtter', points: 8100 },
  { rank: 9, user: 'ZealousZebra', points: 7600 },
  { rank: 10, user: 'MajorMark', points: 7200 },
]

export default function Leaderboard() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold text-gradient-pink">
          Eimy's Top Fans
        </h1>
        <p className="text-muted-foreground font-serif italic mt-2">
          See who's making the biggest impact in our community
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Trophy className="h-8 w-8 text-pink" />
            <div>
              <CardTitle>Community Leaderboard</CardTitle>
              <CardDescription>
                Top 10 users with the most points
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Rank</TableHead>
                <TableHead>User</TableHead>
                <TableHead className="text-right">Points</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboardData.map((item) => (
                <TableRow key={item.rank}>
                  <TableCell className="font-medium">{item.rank}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{item.user}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{item.points}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
