import { Id } from '@/convex/_generated/dataModel'
import { create } from 'zustand'

type State = {
surahId: null | Id<"Surahs">
}

type Actions = {
    setSurahId: (id:Id<"Surahs">|null) => void
}



export const useStore = create<State & Actions>()((set) => ({
  surahId: null,
  setSurahId: (id)=> set({surahId:id})
}))