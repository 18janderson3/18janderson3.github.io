package com.example.musicapp

import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import androidx.recyclerview.widget.RecyclerView

class StreamAdapter(
    private val streams: MutableList<String>
) : RecyclerView.Adapter<StreamAdapter.VH>() {

    class VH(view: View) : RecyclerView.ViewHolder(view) {
        val url: EditText = view.findViewById(R.id.streamUrl)
    }

    override fun onCreateViewHolder(
        parent: ViewGroup,
        viewType: Int
    ): VH {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.stream_item, parent, false)
        return VH(view)
    }

    override fun onBindViewHolder(holder: VH, position: Int) {
        holder.url.setText(streams[position])

        holder.url.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun afterTextChanged(s: Editable?) {}

            override fun onTextChanged(
                s: CharSequence?,
                start: Int,
                before: Int,
                count: Int
            ) {
                val pos = holder.bindingAdapterPosition
                if (pos != RecyclerView.NO_POSITION) {
                    streams[pos] = s.toString()
                }
            }
        })
    }

    override fun getItemCount() = streams.size
}
