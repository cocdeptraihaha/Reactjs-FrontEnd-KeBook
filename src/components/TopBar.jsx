
import { Bar, Mini } from './TopBar.styles'
export function TopBar() {
  return (
    <Bar>
      <Mini to="/app/home">Books</Mini>
      <Mini to="/app/home">Atelier</Mini>
      <Mini to="/app/book/1">Book</Mini>
    </Bar>
  )
}
