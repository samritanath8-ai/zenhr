<?php

namespace App\Notifications;

use App\Models\AssetTransfer;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TransferRequested extends Notification
{
    use Queueable;

    public function __construct(public AssetTransfer $transfer) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        $assetName   = $this->transfer->asset->name ?? 'Unknown Asset';
        $fromName    = $this->transfer->fromUser->name ?? 'Unassigned';
        $toName      = $this->transfer->toUser->name ?? 'Unknown';
        $requester   = $this->transfer->requester->name ?? 'Unknown';

        return (new MailMessage)
            ->subject('Transfer Request Pending: ' . $assetName)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('A new asset transfer request requires your review.')
            ->line('**Asset:** ' . $assetName)
            ->line('**From:** ' . $fromName)
            ->line('**To:** ' . $toName)
            ->line('**Requested by:** ' . $requester)
            ->line('**Reason:** ' . ($this->transfer->reason ?? 'N/A'))
            ->action('Review Transfer', url('/transfers'))
            ->line('Please log in to approve or reject this request.');
    }
}