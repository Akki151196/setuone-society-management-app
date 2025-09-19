"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Trophy } from "lucide-react"

// Mock data - replace with actual data fetching
const mockCompletedPolls = [
  {
    id: "1",
    title: "Parking Fee Increase",
    description: "Should we increase parking fees to fund security improvements?",
    options: [
      { id: "yes", text: "Yes, increase fees", votes: 89, isWinner: true },
      { id: "no", text: "No, keep current fees", votes: 45, isWinner: false },
      { id: "alternative", text: "Find alternative funding", votes: 22, isWinner: false },
    ],
    totalVotes: 156,
    totalMembers: 156,
    endDate: "2024-01-10",
    category: "Finance",
    participationRate: 100,
  },
  {
    id: "2",
    title: "Garden Maintenance Schedule",
    description: "How often should professional garden maintenance be scheduled?",
    options: [
      { id: "weekly", text: "Weekly", votes: 34, isWinner: false },
      { id: "biweekly", text: "Bi-weekly", votes: 78, isWinner: true },
      { id: "monthly", text: "Monthly", votes: 32, isWinner: false },
    ],
    totalVotes: 144,
    totalMembers: 156,
    endDate: "2024-01-05",
    category: "Maintenance",
    participationRate: 92.3,
  },
  {
    id: "3",
    title: "New Year Celebration Budget",
    description: "What should be the budget for the New Year celebration?",
    options: [
      { id: "low", text: "₹25,000", votes: 28, isWinner: false },
      { id: "medium", text: "₹50,000", votes: 95, isWinner: true },
      { id: "high", text: "₹75,000", votes: 18, isWinner: false },
    ],
    totalVotes: 141,
    totalMembers: 156,
    endDate: "2023-12-20",
    category: "Events",
    participationRate: 90.4,
  },
]

export function PollResults() {
  const [completedPolls] = useState(mockCompletedPolls)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Finance":
        return "bg-orange-100 text-orange-800"
      case "Maintenance":
        return "bg-green-100 text-green-800"
      case "Events":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      {completedPolls.map((poll) => (
        <Card key={poll.id}>
          <CardHeader>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg">{poll.title}</CardTitle>
                <Badge className={getCategoryColor(poll.category)} variant="secondary">
                  {poll.category}
                </Badge>
              </div>
              <CardDescription>{poll.description}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Results */}
            <div className="space-y-3">
              {poll.options.map((option) => {
                const percentage = (option.votes / poll.totalVotes) * 100
                return (
                  <div key={option.id} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-2">
                        <span>{option.text}</span>
                        {option.isWinner && <Trophy className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <span className="font-medium">
                        {option.votes} votes ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>

            {/* Poll Stats */}
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {poll.totalVotes}/{poll.totalMembers} participated ({poll.participationRate.toFixed(1)}%)
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Ended {new Date(poll.endDate).toLocaleDateString()}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
