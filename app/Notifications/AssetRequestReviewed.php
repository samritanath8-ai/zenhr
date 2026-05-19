<?php

namespace App\Notifications;

use App\Models\AssetRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AssetRequestReviewed extends Notification
{
    use Queueable;

    public function __construct(public AssetRequest $assetRequest) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $approved = $this->assetRequest->status === 'approved';
        $assetName = $this->assetRequest->asset->name ?? 'Unknown Asset';

        $mail = (new MailMessage)
            ->subject('Asset Request ' . ucfirst($this->assetRequest->status) . ': ' . $assetName)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Your request for **' . $assetName . '** has been **' . $this->assetRequest->status . '**.');

        if ($approved) {
            $mail->line('The asset has been assigned to you. Please log in to view it.')
                 ->action('View My Assets', url('/profile'));
        } else {
            $reason = $this->assetRequest->rejection_reason ?? 'No reason provided.';
            $mail->line('**Reason:** ' . $reason)
                 ->action('Browse Available Assets', url('/requests'));
        }

        return $mail->line('Thank you for using ZenHR.');
    }
}