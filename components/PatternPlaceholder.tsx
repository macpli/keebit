interface PatternPlaceholderProps {
    color?: string
    name?: string
  }

// function getRandomColor(): string {
//   const letters = '0123456789ABCDEF';
//   let color = '#';
//   for (let i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color;
// }

function getColorFromName(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  }
  
  export function PatternPlaceholder({ name = "Collection" }: PatternPlaceholderProps) {
    const color = getColorFromName(name);

    // Generate initials from the collection name
    const initials = name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  
    // Create a lighter version of the color
    const bgColor = `${color}15` // 15 = ~10% opacity in hex
  
    return (
      <div className="w-full h-full relative overflow-hidden" style={{ backgroundColor: bgColor }}>
        {/* Pattern background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-5">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="border rounded-full m-1" style={{ borderColor: color }}></div>
            ))}
          </div>
        </div>
  
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-xl font-bold text-white"
            style={{ backgroundColor: color }}
          >
            {initials}
          </div>
          <div className="text-center">
            <div className="text-sm font-medium mb-1">{name}</div>
            <div className="text-xs text-muted-foreground">No preview image available</div>
          </div>
        </div>
      </div>
    )
  }