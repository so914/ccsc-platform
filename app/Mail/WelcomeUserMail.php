<?php

namespace App\Mail;

use App\Models\User;
use BaconQrCode\Renderer\GDLibRenderer;
use BaconQrCode\Writer;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WelcomeUserMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public User $user)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(
                config('mail.from.address'),
                config('mail.from.name')
            ),
            subject: 'Bienvenue ! Voici votre code QR',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.welcome',
            with: [
                'user' => $this->user,
            ],
        );
    }

    public function attachments(): array
    {
        $renderer = new GDLibRenderer(400);

        $writer = new Writer($renderer);

        $qrCodeData = $writer->writeString(
            'https://example.com'
        );

        $path = storage_path('app/qrcode-' . $this->user->id . '.png');

        file_put_contents($path, $qrCodeData);

        return [
            \Illuminate\Mail\Mailables\Attachment::fromPath($path)
                ->as('qrcode.png')
                ->withMime('image/png'),
        ];
    }
}