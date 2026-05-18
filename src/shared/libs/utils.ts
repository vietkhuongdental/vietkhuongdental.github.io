/* eslint-disable camelcase */
/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/naming-convention */

import type { PicklistOption } from '@/shared/components/blocks/Picklist';
import { AesCtrStream } from '@/shared/hooks/AesStream';
import {
  QueryClient,
  defaultShouldDehydrateQuery
} from '@tanstack/react-query';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formattedDate = (date: string, isShowTime?: boolean): string => {
  const dateObj = new Date(date);

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = dateObj.getFullYear();

  let result = `${day}/${month}/${year}`;

  if (isShowTime) {
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    result += ` ${hours}:${minutes}`;
  }

  return result;
};

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending'
      }
    }
  });
}

let browserQueryClient: QueryClient | undefined;

export const combineInitialOptions = ({
  selectedOptions = [],
  newFetchedOptions
}: {
  newFetchedOptions: PicklistOption[];
  selectedOptions?: PicklistOption[];
}): PicklistOption[] => {
  const combinedOptions = [...selectedOptions];

  newFetchedOptions.forEach((newFetchedOption) => {
    const exists = selectedOptions?.some(
      (selectedOption) => selectedOption.value === newFetchedOption.value
    );

    if (!exists) {
      combinedOptions.push(newFetchedOption);
    }
  });

  return combinedOptions;
};

export function getQueryClient() {
  browserQueryClient ||= makeQueryClient();
  return browserQueryClient;
}

export const stringify = (
  params: Record<string, boolean | number | string | string[] | undefined>,
  excludeKey: string[] = []
): string => {
  if (!params) return '';

  return Object.keys(params)
    .filter(
      (key) =>
        !excludeKey.includes(key) && // skip excluded keys
        params[key] !== undefined &&
        params[key] !== null &&
        params[key] !== '' // skip empty string
    )
    .flatMap((key) => {
      const value = params[key];

      if (Array.isArray(value)) {
        // skip if array is empty
        return value.length
          ? value.map((v) => `${key}=${encodeURIComponent(v)}`)
          : [];
      }

      return [`${key}=${encodeURIComponent(String(value))}`];
    })
    .join('&');
};

export async function generateBase64Key(): Promise<Uint8Array> {
  // 1. Generate a 256-bit AES-GCM key
  const key = await window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256
    },
    true, // extractable so we can export it
    ['encrypt', 'decrypt']
  );

  // 2. Export raw key (as ArrayBuffer)
  const rawKey = await window.crypto.subtle.exportKey('raw', key);
  return new Uint8Array(rawKey);
}

export function toBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

export function fromBase64(str: string): Uint8Array {
  return Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
}

export function convertUuidToShortNumber(uuid: string) {
  if (typeof uuid !== 'string') {
    throw new TypeError('UUID must be a string');
  }

  // Remove dashes from the UUID
  const cleanedUuid = uuid.replace(/-/g, '');
  // Extract first 5 characters
  const shortHex = cleanedUuid.substring(0, 5);
  // Convert hex to number
  const shortNumber = parseInt(shortHex, 16);

  if (isNaN(shortNumber)) {
    throw new Error('Invalid UUID format');
  }

  return shortNumber;
}

export async function encryptKeyBySignature({
  key,
  signature
}: {
  key: Uint8Array;
  signature: string;
}): Promise<string> {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // iv1
  const passphraseBytes = fromBase64(signature);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    passphraseBytes,
    'AES-GCM',
    false,
    ['encrypt']
  );

  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    key
  );

  const encryptedBytes = new Uint8Array(encrypted);

  const combined = new Uint8Array(encryptedBytes.length + iv.length);
  combined.set(iv, 0);
  combined.set(encryptedBytes, iv.length);

  return toBase64(combined.buffer);
}

export async function decryptKeyBySignature({
  encryptedKey,
  signature
}: {
  encryptedKey: string;
  signature: string;
}): Promise<ArrayBuffer> {
  const combinedBase64 = fromBase64(encryptedKey);

  const iv = combinedBase64.slice(0, 12);

  const encryptedBytes = combinedBase64.slice(12);

  const passphraseBytes = fromBase64(signature);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    passphraseBytes,
    'AES-GCM',
    false,
    ['decrypt']
  );

  return await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encryptedBytes
  );
}

export const handleDecryptAndDownloadFile = async ({
  presignedUrl,
  encryptedKey,
  signature,
  fileName
}: {
  encryptedKey?: string;
  fileName: string;
  presignedUrl: string;
  signature?: string;
}) => {
  // 1. FETCH DOWNLOADING PROCESS
  const response = await fetch(presignedUrl, {
    method: 'GET',
    headers: {
      'Content-Range': 'bytes */*',
      'Content-Type': 'application/octet-stream'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  const chunks: Uint8Array[] = [];

  if (!encryptedKey || !signature) {
    // 2. 3. 4. Raw download: just read the original response stream
    const reader = response.body?.getReader();
    if (!reader) return;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
  } else {
    // 2. Get and calculate iv
    const iv2_plainTextDEK = await decryptKeyBySignature({
      encryptedKey,
      signature
    });

    // 3. Decrypt Stream
    const aesStream = new AesCtrStream(new Uint8Array(iv2_plainTextDEK));

    // 4. Collect decrypted chunks
    const reader = response.body?.pipeThrough(aesStream).getReader();

    while (true) {
      if (!reader) {
        return;
      }

      const { value, done } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
  }

  // 5. Create Blob and trigger download
  const blob = new Blob([...[...chunks]], {
    type: 'application/octet-stream'
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName.slice(-20)}`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
};

export const handleFetchingFile = async ({
  presignedUrl
}: {
  presignedUrl: string;
}) => {
  // 1. FETCH DOWNLOADING PROCESS
  const response = await fetch(presignedUrl, {
    method: 'GET',
    headers: {
      'Content-Range': 'bytes */*',
      'Content-Type': 'application/octet-stream'
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${response.statusText}`);
  }

  const chunks: Uint8Array[] = [];

  // 2. Raw download: just read the original response stream
  const reader = response.body?.getReader();
  if (!reader) return;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const blob = new Blob([...[...chunks]], {
    type: 'application/octet-stream'
  });

  return blob;
};

export async function calculateSHA256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer(); // Reads whole file into memory
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function parseAcceptFormats(acceptFormats: string): Set<string> {
  return new Set(
    acceptFormats
      .split(',')
      .map((format) => format.trim().replace(/^\./, '').toLowerCase())
      .map((format) => {
        if (format === 'vcf') return 'vcard';
        if (format === 'docx')
          return 'vnd.openxmlformats-officedocument.wordprocessingml.document';
        return format;
      })
      .filter(Boolean)
  );
}

export function normalizeExtension(ext: string): string {
  if (!ext) return ext;

  const lower = ext.toLowerCase();

  switch (lower) {
    case 'x-vcard':
      return 'vcard';
    default:
      return lower;
  }
}
