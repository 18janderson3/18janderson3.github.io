package com.example.musicapp

import androidx.media3.common.util.UnstableApi
import androidx.media3.common.Player
import androidx.media3.common.Metadata
import androidx.media3.extractor.metadata.icy.IcyInfo
import androidx.media3.extractor.metadata.id3.TextInformationFrame
import android.app.PendingIntent
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.content.pm.ServiceInfo
import androidx.media3.session.MediaSession
import android.os.IBinder
import androidx.core.app.NotificationCompat
import androidx.media3.common.MediaItem
import androidx.media3.exoplayer.ExoPlayer

import android.view.KeyEvent
import androidx.core.content.IntentCompat

@UnstableApi
class AudioService : Service() {

    private lateinit var player: ExoPlayer
    private lateinit var mediaSession: MediaSession

    private fun updateNotification() {
        val manager = getSystemService(NotificationManager::class.java)
        manager.notify(1, createNotification())
    }

    private var currentSongTitle: String = "Live stream"
    private var currentArtist: String = "Unknown artist"

    private fun playStream(index: Int) {
        currentStreamIndex = (index + streams.size) % streams.size

        val mediaItem = MediaItem.fromUri(streams[currentStreamIndex])
        player.setMediaItem(mediaItem)
        player.prepare()
        player.play()
    }


    private lateinit var streams: List<String>

    //private var streams = listOf(
    //    "https://stream.revma.ihrhls.com/zc9003/hls.m3u8",
    //    "https://stream.revma.ihrhls.com/zc6946/hls.m3u8",
    //    "https://stream.onlyhit.us/stream/4/",
    //    "https://quincy.torontocast.com:2020/stream/1/"
    //    )


    private var currentStreamIndex = 0

    private fun playNextStream() {
        currentStreamIndex = (currentStreamIndex + 1) % streams.size
        playStream(currentStreamIndex)
    }

    private fun playPreviousStream() {
        currentStreamIndex =
            if (currentStreamIndex - 1 < 0) streams.lastIndex
            else currentStreamIndex - 1

        playStream(currentStreamIndex)
    }

    override fun onCreate() {
        super.onCreate()
        streams = Settings.loadStreams(this)
        if (streams.isEmpty()) return


        player = ExoPlayer.Builder(this).build()

        mediaSession = MediaSession.Builder(this, player)
            .setCallback(object : MediaSession.Callback {

                override fun onMediaButtonEvent(
                    session: MediaSession,
                    controllerInfo: MediaSession.ControllerInfo,
                    intent: Intent
                ): Boolean {

                    val keyEvent = IntentCompat.getParcelableExtra(intent, Intent.EXTRA_KEY_EVENT, KeyEvent::class.java)
                        ?: return false

                    if (keyEvent.action != KeyEvent.ACTION_DOWN) return false

                    when (keyEvent.keyCode) {
                        KeyEvent.KEYCODE_MEDIA_NEXT -> {
                            playNextStream()
                            return true
                        }

                        KeyEvent.KEYCODE_MEDIA_PREVIOUS -> {
                            playPreviousStream()
                            return true
                        }
                    }

                    return false
                }
            })
            .build()


        playStream(currentStreamIndex)

        player.addListener(object : Player.Listener {
            override fun onMetadata(metadata: Metadata) {
                var updated = false
                for (i in 0 until metadata.length()) {
                    //Log.d("METADATA", metadata[i].toString())
                    when (val entry = metadata[i]) {

                        is IcyInfo -> {
                            entry.title?.let {
                                val parts = it.split(" - ", limit = 2)
                                val newTitle = parts[0]
                                val newArtist = parts[1]
                                if (newTitle != currentSongTitle) {
                                    currentSongTitle = newTitle
                                    currentArtist = newArtist
                                    updated = true
                                }
                            }
                        }

                        is TextInformationFrame -> {
                            when (entry.id) {
                                "TIT2" -> {
                                    entry.values[0]?.let {
                                        if (it != currentSongTitle) {
                                            currentSongTitle = it
                                            updated = true
                                        }
                                    }
                                }

                                "TPE1" -> {
                                    entry.values[0].let {
                                        if (it != currentArtist) {
                                            currentArtist = it
                                            updated = true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (updated) {
                    updateNotification()
                }
            }
        })

    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startForeground(1, createNotification(), ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK)
        return START_STICKY
    }

    override fun onDestroy() {
        player.stop()
        player.release()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null



    private fun createNotification(): Notification {
        val channelId = "audio_playback"
        val channel = NotificationChannel(
            channelId,
            "Audio Playback",
            NotificationManager.IMPORTANCE_LOW
        )
        getSystemService(NotificationManager::class.java)
            .createNotificationChannel(channel)
        val deleteIntent = PendingIntent.getBroadcast(
            this,
            0,
            Intent(this, StopPlaybackReceiver::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, channelId)
            .setContentTitle(currentSongTitle)
            .setContentText(currentArtist)
            .setSmallIcon(android.R.drawable.ic_media_play)
            //.setOngoing(true) // foreground service
            .setDeleteIntent(deleteIntent) // 👈 THIS is the key
            .build()
    }
}
