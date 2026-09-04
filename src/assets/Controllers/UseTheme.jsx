import {useContext} from 'react'
import {ThemeContext} from '../Controllers/ThemeContext'
import { COLORS, DARKCOLORS } from '../utils/colors'

export const UseTheme = () => {
    const { mode } = useContext(ThemeContext)
  return mode === 'dark' ? DARKCOLORS : COLORS
}
