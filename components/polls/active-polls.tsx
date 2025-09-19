"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Clock } from "lucide-react"

// Mock data - replace with actual data fetching
const mockPolls = [
  {
    id: "1",
    title: "Swimming Pool Renovation",
    description: "Should we proceed with the swimming pool renovation project as proposed?",
    options: [
      { id: "yes", text: "Yes, proceed with renovation", votes: 45 },
      { id: "no", text: "No, postpone for now", votes: 12 },
      { id: "modify", text: "Modify the proposal", votes: 8 },
    ],
    totalVotes: 65,
    totalMembers: 156,
    endDate: "2024-01-20",
    hasVoted: false,
    category: "Infrastructure",
  },
  {
    id: "2",
    title: "New Gym Equipment",
    description: "Which type of equipment should we prioritize for the gym upgrade?",
    options: [
      { id: "cardio", text: "Cardio machines", votes: 28 },
      { id: "weights", text: "Weight training equipment", votes: 22 },
      { id: "functional", text: "Functional training gear", votes: 15 },
    ],
    totalVotes: 65,
    totalMembers: 156,
    endDate: "2024-01-18",
    hasVoted: false,
    category: "Amenities",
  },
  {
    id: "3",
    title: "Community Event Timing",
    description: "What time works best for the monthly community gathering?",
    options: [
      { id: "morning", text: "Saturday Morning (10 AM)", votes: 18 },
      { id: "afternoon", text: "Saturday Afternoon (4 PM)", votes: 32 },
      { id: "evening", text: "Saturday Evening (6 PM)", votes: 25 },
    ],
    totalVotes: 75,
    totalMembers: 156,
    endDate: "2024-01-16",
    hasVoted: true,
    category: "Events",
  },
]

export function ActivePolls() {
  const [polls, setPolls] = useState(mockPolls)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})

  const handleVote = (pollId: string) => {
    const selectedOption = selectedOptions[pollId]
    if (!selectedOption) return

    // Update poll data
    setPolls(
      polls.map((poll) => {
        if (poll.id === pollId) {
          return {
            ...poll,
            hasVoted: true,
            options: poll.options.map((option) =>
              option.id === selectedOption ? { ...option, votes: option.votes + 1 } : option,
            ),
            totalVotes: poll.totalVotes + 1,
          }
        }
        return poll
      }),
    )

    // Clear selection
    setSelectedOptions({ ...selectedOptions, [pollId]: "" })
  }

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diffTime = end.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Infrastructure":
        return "bg-blue-100 text-blue-800"
      case "Amenities":
        return "bg-green-100 text-green-800"
      case "Events":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      {polls.map((poll) => {
        const participationRate = (poll.totalVotes / poll.totalMembers) * 100
        const daysRemaining = getDaysRemaining(poll.endDate)

        return (
          <Card key={poll.id} className="border-l-4 border-l-primary">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg">{poll.title}</CardTitle>
                    <Badge className={getCategoryColor(poll.category)} variant="secondary">
                      {poll.category}
                    </Badge>
                  </div>
                  <CardDescription>{poll.description}</CardDescription>
                </div>
                {poll.hasVoted && <Badge className="bg-green-100 text-green-800">Voted</Badge>}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {poll.hasVoted ? (
                // Show results if already voted
                <div className="space-y-3">
                  {poll.options.map((option) => {
                    const percentage = poll.totalVotes > 0 ? (option.votes / poll.totalVotes) * 100 : 0
                    return (
                      <div key={option.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{option.text}</span>
                          <span className="font-medium">
                            {option.votes} votes ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              ) : (
                // Show voting interface
                <div className="space-y-4">
                  <RadioGroup
                    value={selectedOptions[poll.id] || ""}
                    onValueChange={(value) => setSelectedOptions({ ...selectedOptions, [poll.id]: value })}
                  >
                    {poll.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.id} id={`${poll.id}-${option.id}`} />
                        <Label htmlFor={`${poll.id}-${option.id}`} className="flex-1 cursor-pointer">
                          {option.text}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  <Button onClick={() => handleVote(poll.id)} disabled={!selectedOptions[poll.id]} className="w-full">
                    Cast Vote
                  </Button>
                </div>
              )}

              {/* Poll Stats */}
              <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {poll.totalVotes}/{poll.totalMembers} voted ({participationRate.toFixed(1)}%)
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {daysRemaining > 0 ? `${daysRemaining} days left` : "Ending today"}
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Ends {new Date(poll.endDate).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
