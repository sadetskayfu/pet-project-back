function parseTimeToMs(timeString: string): number {
    const timeUnits = {
      s: 1000, // секунды
      m: 1000 * 60, // минуты
      h: 1000 * 60 * 60, // часы
      d: 1000 * 60 * 60 * 24, // дни
    };
  
    // Регулярное выражение для поиска числа и единицы измерения
    const match = timeString.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid time string: ${timeString}`);
    }
  
    const value = parseInt(match[1], 10); // Число (например, 3)
    const unit = match[2]; // Единица измерения (например, 'm')
  
    if (!timeUnits[unit]) {
      throw new Error(`Unknown time unit: ${unit}`);
    }
  
    return value * timeUnits[unit];
  }