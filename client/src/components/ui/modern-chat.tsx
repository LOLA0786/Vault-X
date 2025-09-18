import * as React from "react"
import { cn } from "@/lib/utils"
import { ModernCard, ModernCardContent } from "./modern-card"
import { ModernInput } from "./modern-input"
import { Button } from "./button"
import { Badge } from "./badge"
import { Avatar, AvatarFallback } from "./avatar"
import { 
  Send, 
  Bot, 
  User, 
  Shield, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  MoreVertical,
  Trash2,
  Edit3
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isEncrypted?: boolean;
}

interface ModernChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  showEncryptionBadge?: boolean;
}

interface ChatMessageProps {
  message: ChatMessage;
  onCopy?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onFeedback?: (type: 'up' | 'down') => void;
}

function ChatMessageComponent({ 
  message, 
  onCopy, 
  onDelete, 
  onEdit, 
  onFeedback 
}: ChatMessageProps) {
  const isUser = message.role === 'user'
  
  return (
    <div className={cn(
      "flex gap-4 group",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <Avatar className="w-10 h-10 border-2 border-border">
        <AvatarFallback className={cn(
          "text-white font-semibold",
          isUser 
            ? "bg-gradient-to-br from-blue-500 to-blue-600" 
            : "bg-gradient-to-br from-violet-500 to-purple-600"
        )}>
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>

      {/* Message Content */}
      <div className={cn(
        "flex-1 max-w-[80%]",
        isUser ? "flex flex-col items-end" : "flex flex-col items-start"
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md",
          isUser 
            ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground ml-auto" 
            : "bg-muted/50 text-foreground border border-border/50"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
          {message.isEncrypted && (
            <Badge variant="secondary" className="mt-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              <Shield className="w-3 h-3 mr-1" />
              Encrypted
            </Badge>
          )}
        </div>

        {/* Message Actions */}
        <div className={cn(
          "flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200",
          isUser ? "flex-row-reverse" : "flex-row"
        )}>
          <span className="text-xs text-muted-foreground">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={onCopy} className="h-7 w-7 p-0">
              <Copy className="h-3 w-3" />
            </Button>
            
            {!isUser && onFeedback && (
              <>
                <Button variant="ghost" size="sm" onClick={() => onFeedback('up')} className="h-7 w-7 p-0">
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onFeedback('down')} className="h-7 w-7 p-0">
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit}>
                    <Edit3 className="w-3 h-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem onClick={onDelete} className="text-red-600">
                    <Trash2 className="w-3 h-3 mr-2" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ModernChat({ 
  messages, 
  onSendMessage, 
  isLoading = false,
  placeholder = "Type your message...",
  className,
  showEncryptionBadge = true
}: ModernChatProps) {
  const [inputValue, setInputValue] = React.useState('')
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim())
      setInputValue('')
    }
  }

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <ModernCard variant="glass" className={cn("flex flex-col h-full", className)}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Assistant</h3>
            <p className="text-sm text-muted-foreground">Private & Encrypted</p>
          </div>
        </div>
        
        {showEncryptionBadge && (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <Shield className="w-3 h-3 mr-1" />
            End-to-End Encrypted
          </Badge>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-purple-200 dark:from-violet-900/30 dark:to-purple-800/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-violet-600 dark:text-violet-400" />
            </div>
            <p className="text-lg font-medium">Start a conversation</p>
            <p className="text-sm">Your messages are encrypted and private</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessageComponent
                key={message.id}
                message={message}
                onCopy={() => handleCopyMessage(message.content)}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-border/50 bg-muted/20">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <ModernInput
            variant="filled"
            inputSize="lg"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            type="submit"
            variant="premium"
            size="lg"
            disabled={!inputValue.trim() || isLoading}
            className="px-6"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
        
        {showEncryptionBadge && (
          <div className="flex items-center justify-center mt-3 text-xs text-muted-foreground">
            <Shield className="w-3 h-3 mr-1" />
            <span>Messages are encrypted before sending</span>
          </div>
        )}
      </div>
    </ModernCard>
  )
}