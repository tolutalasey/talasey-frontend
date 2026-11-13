import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TextAreaField } from './TextAreaField';

describe('TextAreaField', () => {
  it('labels the text area and sends its value with the form', () => {
    render(
      <TextAreaField label="Answer" name="answer" defaultValue="Yes" description="Two lines" />,
    );
    const box = screen.getByRole('textbox', { name: 'Answer' });
    expect(box.tagName).toBe('TEXTAREA');
    expect(box).toHaveProperty('name', 'answer');
    expect(screen.getByText('Two lines')).toBeTruthy();
  });
});
