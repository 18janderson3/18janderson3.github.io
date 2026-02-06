package com.example.musicapp

import android.bluetooth.BluetoothA2dp
import android.bluetooth.BluetoothDevice
import android.bluetooth.BluetoothProfile
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat
import android.Manifest
import android.content.pm.PackageManager
import androidx.annotation.OptIn
import androidx.core.content.IntentCompat
import androidx.media3.common.util.UnstableApi

class BluetoothReceiver : BroadcastReceiver() {
    @OptIn(UnstableApi::class)
    override fun onReceive(context: Context, intent: Intent) {

        if (intent.action != BluetoothA2dp.ACTION_CONNECTION_STATE_CHANGED) return

        // Android 12+ permission check
        if (context.checkSelfPermission(Manifest.permission.BLUETOOTH_CONNECT)
            != PackageManager.PERMISSION_GRANTED
        ) {
            return
        }

        val state = intent.getIntExtra(
            BluetoothProfile.EXTRA_STATE,
            BluetoothProfile.STATE_DISCONNECTED
        )

        val device = IntentCompat.getParcelableExtra(intent, BluetoothDevice.EXTRA_DEVICE, BluetoothDevice::class.java) ?: return

        val serviceIntent = Intent(context, AudioService::class.java)
        context.stopService(serviceIntent)

        if (state == BluetoothProfile.STATE_CONNECTED) {
            val bluetoothDeviceName = Settings.loadBluetoothName(context)
            if (device.name?.contains(bluetoothDeviceName, ignoreCase = true) == true) {

                val serviceIntent = Intent(context, AudioService::class.java)
                ContextCompat.startForegroundService(context, serviceIntent)
            }
        }
        if (state != BluetoothProfile.STATE_CONNECTED){
                val serviceIntent = Intent(context, AudioService::class.java)
                context.stopService(serviceIntent)
        }
    }
}

