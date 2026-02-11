"use client"

import * as React from "react"
import { Delete } from "lucide-react"
import { Button } from "@/components/ui/button"

interface KeypadProps {
    onDigitPress: (digit: string) => void
    onDeletePress: () => void
    maxLength?: number
    currentLength?: number
}

export function Keypad({ onDigitPress, onDeletePress, maxLength = 4, currentLength = 0 }: KeypadProps) {
    const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"]

    return (
        <div className="grid grid-cols-3 gap-4 max-w-[250px] mx-auto mt-4">
            {digits.map((digit, index) => {
                if (digit === "") return <div key={index} />
                if (digit === "del") {
                    return (
                        <Button
                            key={index}
                            variant="ghost"
                            size="lg"
                            className="h-16 w-16 rounded-full text-xl"
                            onClick={onDeletePress}
                            disabled={currentLength === 0}
                        >
                            <Delete className="h-6 w-6" />
                        </Button>
                    )
                }
                return (
                    <Button
                        key={index}
                        variant="outline"
                        size="lg"
                        className="h-16 w-16 rounded-full text-2xl font-semibold hover:bg-primary/10"
                        onClick={() => {
                            if (currentLength < maxLength) onDigitPress(digit)
                        }}
                        disabled={currentLength >= maxLength}
                    >
                        {digit}
                    </Button>
                )
            })}
        </div>
    )
}
