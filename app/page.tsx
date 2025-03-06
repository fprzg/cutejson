"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ClipboardCopy, ClipboardPaste, Check } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function JsonPrettifier() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [pasted, setPasted] = useState(false)

  const prettifyJson = () => {
    try {
      if (!input.trim()) {
        setOutput("")
        setError(null)
        return
      }

      const parsedJson = JSON.parse(input)
      const prettified = JSON.stringify(parsedJson, null, 2)
      setOutput(prettified)
      setError(null)
    } catch (err) {
      setError("Invalid JSON: " + (err instanceof Error ? err.message : "Unknown error"))
      setOutput("")
    }
  }

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setInput(text)
      setPasted(true)
      setTimeout(() => setPasted(false), 2000)
    } catch (err) {
      console.error("Failed to paste: ", err)
    }
  }

  const copyToClipboard = async () => {
    if (!output) return

    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">JSON Prettifier</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Input JSON</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={pasteFromClipboard}
              //disabled={!output}
              className="flex items-center gap-1"
            >
              {pasted ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Pasted!</span>
                </>
              ) : (
                <>
                  <ClipboardCopy className="h-4 w-4" />
                  <span>Paste</span>
                </>
              )}
            </Button>
          </div>
          <Textarea
            placeholder="Paste your JSON here..."
            className="min-h-[300px] font-mono text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Cute JSON</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              disabled={!output}
              className="flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <ClipboardCopy className="h-4 w-4" />
                  <span>Copy</span>
                </>
              )}
            </Button>
          </div>
          <Textarea
            readOnly
            placeholder="Prettified JSON will appear here..."
            className="min-h-[300px] font-mono text-sm"
            value={output}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button onClick={prettifyJson} className="w-full">
        Prettify
      </Button>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Paste your JSON in the left textarea and click "Prettify" to format it.</p>
        <p>Use the copy button to copy the formatted JSON to your clipboard.</p>
      </div>
    </div>
  )
}

