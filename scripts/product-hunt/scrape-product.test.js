import assert from 'node:assert/strict'
import test from 'node:test'

import {
  parseLaunchingToday,
  parseProductHuntProductStats,
  parseProductHuntProductPage,
} from './scrape-product.js'

test('parses day rank and upvote points from Product Hunt HTML', () => {
  const html = `
    <div><div class="text-3xl font-semibold text-gray-900">#<!-- -->9</div><div class="text-sm font-semibold text-gray-700">Day Rank</div></div>
    <div class="text-base font-semibold leading-none text-white">Upvote<span> • 218 points</span></div>
  `

  assert.deepEqual(parseProductHuntProductStats(html), {
    dayRank: '#9',
    upvotes: 218,
  })
})

test('detects Launching Today from embedded JSON', () => {
  const html = `"launchingToday":true,"launchNumber":1`
  assert.equal(parseLaunchingToday(html), true)
})

test('detects Launching Today from visible sidebar label', () => {
  const html = `
    <div class="px-4 text-lg font-semibold sm:px-0 ">Launching Today</div>
    <div class="text-3xl font-semibold text-gray-900">#2</div>
    <div class="text-sm font-semibold text-gray-700">Day Rank</div>
  `
  assert.equal(parseLaunchingToday(html), true)
})

test('returns false when embedded launchingToday is false', () => {
  const html = `"launchingToday":false,"dailyRank":"7"`
  assert.equal(parseLaunchingToday(html), false)
})

test('parseProductHuntProductPage adds launch status without breaking stats', () => {
  const html = `
    "launchingToday":true
    <div>#3</div><div>Day Rank</div>
    Upvote<span> • 10 points</span>
    <div>Launching Today</div>
  `
  const page = parseProductHuntProductPage(html)
  assert.equal(page.launchingToday, true)
  assert.equal(page.launchStatusLabel, 'Launching Today')
  assert.equal(page.dayRank, '#3')
  assert.equal(page.upvotes, 10)
})
