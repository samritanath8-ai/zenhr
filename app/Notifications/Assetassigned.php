<?php

namespace App\Notifications;

use App\Models\Asset;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AssetAssigned extends Notification
{
    use Queueable;

    public function __construct(public Asset $asset, public string $assignedByName) {}

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Asset Assigned: ' . $this->asset->name)
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('An asset has been assigned to you by ' . $this->assignedByName . '.')
            ->line('**Asset:** ' . $this->asset->name . ' (' . $this->asset->asset_number . ')')
            ->line('**Type:** ' . $this->asset->type)
            ->line('**Serial Number:** ' . ($this->asset->serial_number ?? 'N/A'))
            ->action('View Asset', url('/assets/' . $this->asset->id . '/edit'))
            ->line('Please log in to ZenHR to view the full details.');
    }
}