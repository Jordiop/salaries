import { computed } from 'vue'
import { SALARY_DATA } from '@/data/salaryData.js'

export function useSalary() {
  function getData(sex, ccaa, year) {
    return SALARY_DATA?.[sex]?.[ccaa]?.[year] || null
  }

  function fmt(n) {
    if (n == null || isNaN(n)) return '—'
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(n)
  }

  function estimatePercentile(salary, d) {
    if (!d || salary <= 0) return 0
    if (salary <= d.p10) return Math.round((salary / d.p10) * 10)
    if (salary <= d.p25) return Math.round(10 + ((salary - d.p10) / (d.p25 - d.p10)) * 15)
    if (salary <= d.p50) return Math.round(25 + ((salary - d.p25) / (d.p50 - d.p25)) * 25)
    if (salary <= d.p75) return Math.round(50 + ((salary - d.p50) / (d.p75 - d.p50)) * 25)
    if (salary <= d.p90) return Math.round(75 + ((salary - d.p75) / (d.p90 - d.p75)) * 15)
    return Math.min(99, Math.round(90 + ((salary - d.p90) / (d.p90 * 0.5)) * 9))
  }

  function getMaxP90(sex, year) {
    const sd = SALARY_DATA[sex]
    if (!sd) return 70000
    let m = 0
    for (const ccaa of Object.keys(sd)) {
      const d = sd[ccaa][year]
      if (d && d.p90 > m) m = d.p90
    }
    return m * 1.15
  }

  function pct(val, sex, year) {
    if (!val) return 0
    return Math.min(100, Math.round((val / getMaxP90(sex, year)) * 100))
  }

  function getRankingRows(sex, year) {
    const sd = SALARY_DATA[sex]
    if (!sd) return []
    return Object.keys(sd)
      .map(ccaa => ({ ccaa, ...(sd[ccaa][year] || {}) }))
      .filter(r => r.p50)
      .sort((a, b) => b.p50 - a.p50)
  }

  function getTrendSeries(sex, ccaa) {
    const sd = SALARY_DATA[sex]?.[ccaa]
    if (!sd) return null
    const sortedYears = Object.keys(sd).sort()
    const series = { p10: [], p25: [], p50: [], p75: [], p90: [] }
    for (const y of sortedYears) {
      const d = sd[y]
      if (!d) continue
      const yr = parseInt(y)
      series.p10.push([yr, d.p10])
      series.p25.push([yr, d.p25])
      series.p50.push([yr, d.p50])
      series.p75.push([yr, d.p75])
      series.p90.push([yr, d.p90])
    }
    return series
  }

  function buildMapData(sex, year) {
    const PROV_TO_CCAA = {
      'es-al': 'Andalucía', 'es-ca': 'Andalucía', 'es-co': 'Andalucía', 'es-gr': 'Andalucía',
      'es-h': 'Andalucía', 'es-j': 'Andalucía', 'es-ma': 'Andalucía', 'es-se': 'Andalucía',
      'es-hu': 'Aragón', 'es-te': 'Aragón', 'es-z': 'Aragón',
      'es-o': 'Asturias, Principado de',
      'es-pm': 'Balears, Illes',
      'es-gc': 'Canarias', 'es-tf': 'Canarias',
      'es-s': 'Cantabria',
      'es-av': 'Castilla y León', 'es-bu': 'Castilla y León', 'es-le': 'Castilla y León',
      'es-p': 'Castilla y León', 'es-sa': 'Castilla y León', 'es-sg': 'Castilla y León',
      'es-so': 'Castilla y León', 'es-va': 'Castilla y León', 'es-za': 'Castilla y León',
      'es-ab': 'Castilla - La Mancha', 'es-cr': 'Castilla - La Mancha',
      'es-cu': 'Castilla - La Mancha', 'es-gu': 'Castilla - La Mancha',
      'es-to': 'Castilla - La Mancha',
      'es-b': 'Cataluña', 'es-gi': 'Cataluña', 'es-l': 'Cataluña', 'es-t': 'Cataluña',
      'es-a': 'Comunitat Valenciana', 'es-cs': 'Comunitat Valenciana', 'es-v': 'Comunitat Valenciana',
      'es-ba': 'Extremadura', 'es-cc': 'Extremadura',
      'es-c': 'Galicia', 'es-lu': 'Galicia', 'es-or': 'Galicia', 'es-po': 'Galicia',
      'es-m': 'Madrid, Comunidad de',
      'es-mu': 'Murcia, Región de',
      'es-na': 'Navarra, Comunidad Foral de',
      'es-bi': 'País Vasco', 'es-ss': 'País Vasco', 'es-vi': 'País Vasco',
      'es-lo': 'Rioja, La',
    }
    const sd = SALARY_DATA[sex]
    if (!sd) return []
    return Object.keys(PROV_TO_CCAA).map(provKey => {
      const ccaa = PROV_TO_CCAA[provKey]
      const d = sd[ccaa]?.[year] || null
      return {
        'hc-key': provKey,
        value: d ? d.p50 : null,
        ccaa,
        p10: d?.p10, p25: d?.p25, p50: d?.p50, p75: d?.p75, p90: d?.p90, media: d?.media,
      }
    })
  }

  const YEARS = ['2023','2022','2021','2020','2019','2018','2017','2016','2015','2014','2013','2012','2011','2010','2009','2008']

  return { SALARY_DATA, getData, fmt, estimatePercentile, pct, getMaxP90, getRankingRows, getTrendSeries, buildMapData, YEARS }
}
