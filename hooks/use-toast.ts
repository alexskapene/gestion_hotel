'use client'

import { useState } from 'react'

export const useToast = () => {
  // Minimal stub for the app's toast hook used by UI components
  const [toasts] = useState<any[]>([])
  return { toasts }
}
