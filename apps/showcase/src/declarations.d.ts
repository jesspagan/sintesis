declare module '*.module.css' {
  const styles: Record<string, string>
  export default styles
}

declare module 'virtual:ui-changelog' {
  const content: string
  export default content
}

declare module '*.md?raw' {
  const content: string
  export default content
}

declare module '*?raw' {
  const content: string
  export default content
}
