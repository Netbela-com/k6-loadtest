import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween, uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { Trend } from 'k6/metrics';

// Metrics
const ttfb = new Trend('ttfb', true);
const page_duration = new Trend('page_duration', true);
const blocking_time = new Trend('blocking_time', true);

// Config from environment variables, with defaults for safety
const BASE = __ENV.BASE_URL || 'https://example.com';
const targetVUs = __ENV.VUS ? parseInt(__ENV.VUS) : 10;

const paths = ['/', '/menu/', '/contact-us/', '/about-us/'];
const userAgents = [
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
  'Mozilla/5.0 (Linux; Android 10)',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
];

export const options = {
  summaryTrendStats: ['avg', 'p(90)', 'p(95)', 'max'],
  stages: [
    { duration: '30s', target: targetVUs }, // ramp-up
    { duration: '2m', target: targetVUs },  // steady load
    { duration: '30s', target: 0 },          // ramp-down
  ],
};

export default function () {
  const path = paths[randomIntBetween(0, paths.length - 1)];
  const headers = {
    'User-Agent': userAgents[randomIntBetween(0, userAgents.length - 1)],
    'Accept': 'text/html,application/xhtml+xml',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  };

  const uniqueURL = `${BASE}${path}?nocache=${uuidv4().slice(0, 6)}`;
  const res = http.get(uniqueURL, { headers });

  ttfb.add(res.timings.waiting);
  page_duration.add(res.timings.duration);
  blocking_time.add(res.timings.blocked);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'TTFB < 500ms': (r) => r.timings.waiting < 500,
  });

  sleep(randomIntBetween(1, 2));
}
