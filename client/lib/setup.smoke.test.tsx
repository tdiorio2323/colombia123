import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'

it('renders', () => {
  render(<div>hola</div>)
  expect(screen.getByText('hola')).toBeInTheDocument()
})
