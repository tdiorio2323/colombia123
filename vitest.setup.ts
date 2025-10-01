/// <reference types="vitest/globals" />
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom' // auto-extends expect

afterEach(() => {
  cleanup()
})
