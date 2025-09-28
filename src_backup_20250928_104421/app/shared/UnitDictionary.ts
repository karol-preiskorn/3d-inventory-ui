/*
 * Description:
 * 2023-06-03  C2RLO
 */

export interface UnitDictionaryItem {
  name: string
  description: string
}
// | 'm' | 'cm' | 'mm' | 'km' | 'g' | 'kg' | 'mg' | 'l' | 'ml' | 's' | 'min' | 'h' = ''
export class UnitDictionary {
  private readonly list: UnitDictionaryItem[] = [
    { name: '', description: 'No unit' },
    { name: 'm', description: 'Meter (length)' },
    { name: 'cm', description: 'Centimeter (length)' },
    { name: 'mm', description: 'Millimeter (length)' },
    { name: 'km', description: 'Kilometer (length)' },
    { name: 'g', description: 'Gram (mass)' },
    { name: 'kg', description: 'Kilogram (mass)' },
    { name: 'mg', description: 'Milligram (mass)' },
    { name: 'l', description: 'Liter (volume)' },
    { name: 'ml', description: 'Milliliter (volume)' },
    { name: 's', description: 'Second (time)' },
    { name: 'min', description: 'Minute (time)' },
    { name: 'h', description: 'Hour (time)' },
    // IT values
    { name: 'B', description: 'Byte (data size)' },
    { name: 'KB', description: 'Kilobyte (data size)' },
    { name: 'MB', description: 'Megabyte (data size)' },
    { name: 'GB', description: 'Gigabyte (data size)' },
    { name: 'TB', description: 'Terabyte (data size)' },
    { name: 'bit', description: 'Bit (data size)' },
    { name: 'kbit', description: 'Kilobit (data size)' },
    { name: 'Mbit', description: 'Megabit (data size)' },
    { name: 'Gbps', description: 'Gigabits per second (data rate)' },
    { name: 'Mbps', description: 'Megabits per second (data rate)' },
    { name: 'Kbps', description: 'Kilobits per second (data rate)' },
    { name: 'Hz', description: 'Hertz (frequency)' },
    { name: 'GHz', description: 'Gigahertz (frequency)' },
    { name: 'MHz', description: 'Megahertz (frequency)' },
    { name: 'kHz', description: 'Kilohertz (frequency)' },
  ]

  getAllUnits(): UnitDictionaryItem[] {
    return [...this.list]
  }

  getRandomUnit(): UnitDictionaryItem {
    const idx = Math.floor(Math.random() * this.list.length)
    return this.list[idx]
  }

  getRandomUnitName(): string {
    return this.getRandomUnit().name
  }

  findUnitByName(name: string): UnitDictionaryItem | undefined {
    return this.list.find((item) => item.name === name)
  }

  logUnitIfExists(name: string): void {
    const item = this.findUnitByName(name)
    if (item) {
      console.log('-->', name)
    }
  }
}
