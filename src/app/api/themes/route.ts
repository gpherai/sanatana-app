import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import { handleGenericError } from '@/lib/api-errors'

export async function GET() {
  try {
    const themesDirectory = path.join(process.cwd(), 'public', 'themes')
    const filenames = await fs.readdir(themesDirectory)

    // Filter for JSON files
    const themeFiles = filenames.filter((file) => file.endsWith('.json'))

    // Read all theme files
    const themes = await Promise.all(
      themeFiles.map(async (filename) => {
        const filePath = path.join(themesDirectory, filename)
        const fileContents = await fs.readFile(filePath, 'utf8')
        return JSON.parse(fileContents)
      })
    )

    // Get current theme from... we'll use spiritual-minimal as default for now
    const currentTheme = 'spiritual-minimal'

    return NextResponse.json({
      success: true,
      data: {
        themes,
        current: currentTheme,
      },
    })
  } catch (error) {
    return handleGenericError(error, 'loading themes')
  }
}
