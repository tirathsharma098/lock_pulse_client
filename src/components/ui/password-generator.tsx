'use client';

import { useEffect, useMemo, useState } from 'react';
import { IconButton } from './icon-button';
import { ContentCopy as CopyIcon, Refresh as RefreshIcon, Check as CheckIcon } from '@mui/icons-material';

const DEFAULT_LENGTH:number = 20;
// const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{};:,.?';
const DEFAULT_CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: '@#$',
};

export function generatePassword({
  length = 18,
} = {}) {
  let charset = '';
  charset += DEFAULT_CHARSETS.upper;
  charset += DEFAULT_CHARSETS.lower;
  charset += DEFAULT_CHARSETS.digits;
  charset += DEFAULT_CHARSETS.symbols;

  if (!charset) throw new Error('No character set selected');

  const max = Math.floor(256 / charset.length) * charset.length;
  const bytes = new Uint8Array(length * 2);
  window.crypto.getRandomValues(bytes);

  const out: string[] = [];
  for (let i = 0; i < bytes.length && out.length < length; i++) {
    if (bytes[i] < max) {
      out.push(charset[bytes[i] % charset.length]);
    }
  }

  const raw = out.join('');
  return raw.match(new RegExp(`.{1,${6}}`, 'g'))!.join('-');
}

interface PasswordGeneratorProps {
  length?: number;
  label?: string;
  className?: string;
}

export function PasswordGenerator({
  length = DEFAULT_LENGTH,
  label = 'Generated Password',
  className,
}: PasswordGeneratorProps) {
  const [value, setValue] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setValue(generatePassword());
  };

  useEffect(() => {
    generate();
  }, [length]);

  const canCopy = useMemo(() => Boolean(value), [value]);

  const copyToClipboard = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  return (
    <div className={`rounded-md border border-gray-200 bg-gray-50 p-3 ${className ?? ''}`.trim()}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-700">{label}</p>
          <p className="mt-1 break-all font-mono text-sm text-gray-900">{value || '—'}</p>
        </div>
        <div className="flex items-center gap-1">
          <IconButton
            type="button"
            variant="ghost"
            onClick={copyToClipboard}
            disabled={!canCopy}
            title="Copy password"
            aria-label="Copy generated password"
            className={
              copied
                ? 'border border-green-500 text-green-600 hover:bg-green-50'
                : undefined
            }
          >
            {copied ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
          </IconButton>
          <IconButton
            type="button"
            variant="ghost"
            onClick={generate}
            title="Regenerate password"
            aria-label="Regenerate password"
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}
