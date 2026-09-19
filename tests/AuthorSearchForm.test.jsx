import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import AuthorSearchForm from '../src/components/AuthorSearchForm.jsx';

describe('AuthorSearchForm', () => {
  it('calls onSearch with the trimmed author name on submit', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<AuthorSearchForm onSearch={onSearch} isLoading={false} />);

    const input = screen.getByLabelText('Nombre del autor');
    await user.type(input, '  jmiranda  ');
    await user.click(screen.getByRole('button', { name: /buscar/i }));

    expect(onSearch).toHaveBeenCalledWith('jmiranda');
  });

  it('does not submit when the field is empty', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<AuthorSearchForm onSearch={onSearch} isLoading={false} />);

    expect(screen.getByRole('button', { name: /buscar/i })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: /buscar/i }));
    expect(onSearch).not.toHaveBeenCalled();
  });
});
