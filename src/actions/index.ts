import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { submitPrayerRequest } from './prayer-actions';

export const server = {
  submitPrayerRequest
}