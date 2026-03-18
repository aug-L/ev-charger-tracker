<template>
  <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-all hover:shadow-indigo-500/5 group relative">
    <!-- Status Badge -->
    <div class="absolute top-4 right-4">
      <span 
        class="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
        :class="{
          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20': session.status === 'charging',
          'bg-slate-700/50 text-slate-400 border-slate-600/50': session.status === 'idle',
          'bg-indigo-500/10 text-indigo-400 border-indigo-500/20': session.status === 'finished'
        }"
      >
        {{ session.status }}
      </span>
    </div>

    <div class="p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-3 bg-slate-800 rounded-xl">
          <Cpu class="w-6 h-6 text-slate-400" />
        </div>
        <div>
          <h4 class="font-bold text-slate-100">{{ session.chargerId }}</h4>
          <p class="text-xs text-slate-500">ID: #{{ session.id }}</p>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <div class="flex justify-between items-end mb-2">
            <span class="text-sm text-slate-400">Energy Delivered</span>
            <span class="text-lg font-mono font-bold">{{ session.energyKwh.toFixed(3) }} <small class="text-[10px] text-slate-500 uppercase">kWh</small></span>
          </div>
          <!-- Progress Bar logic -->
           <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
             <div 
               v-if="session.status === 'charging'"
               class="h-full bg-indigo-500 animate-pulse transition-all duration-300"
               :style="{ width: (Math.min((session.energyKwh / 100) * 100, 100)) + '%' }"
             ></div>
             <div 
               v-else-if="session.status === 'finished'"
               class="h-full bg-emerald-500 w-full"
             ></div>
           </div>
        </div>

        <div class="grid grid-cols-2 gap-4 py-4 border-y border-slate-800/50">
          <div>
            <p class="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Cost (Est.)</p>
            <p class="font-bold">${{ (session.cost || (session.energyKwh * 2.5)).toFixed(2) }}</p>
          </div>
          <div>
            <p class="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Duration</p>
            <p class="text-sm font-medium">{{ duration }}</p>
          </div>
        </div>

        <div class="flex gap-2">
          <button 
            v-if="session.status === 'idle'"
            @click="handleStart"
            :disabled="loading"
            class="flex-1 bg-white hover:bg-slate-200 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50"
          >
            Start Charging
          </button>
          <button 
            v-if="session.status === 'charging'"
            @click="handleStop"
            :disabled="loading"
            class="flex-1 bg-red-600 hover:bg-red-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Square class="w-4 h-4 fill-current" />
            Stop
          </button>
          <div 
            v-if="session.status === 'finished'"
            class="flex-1 text-center py-2 text-xs text-slate-500 italic"
          >
            Session completed
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Cpu, Square } from 'lucide-vue-next';
import { startSession, stopSession } from '../services/api';

const props = defineProps(['session']);
const emit = defineEmits(['refresh']);
const loading = ref(false);

const duration = computed(() => {
  if (!props.session.startTime) return '--:--';
  const start = new Date(props.session.startTime);
  const end = props.session.endTime ? new Date(props.session.endTime) : new Date();
  const diff = Math.floor((end - start) / 1000); // seconds
  const mins = Math.floor(diff / 60);
  const secs = diff % 60;
  return `${mins}m ${secs}s`;
});

const handleStart = async () => {
  loading.value = true;
  try {
    await startSession(props.session.id);
    emit('refresh');
  } catch (error) {
    console.error('Start failed:', error);
  } finally {
    loading.value = false;
  }
};

const handleStop = async () => {
  loading.value = true;
  try {
    await stopSession(props.session.id);
    emit('refresh');
  } catch (error) {
    console.error('Stop failed:', error);
  } finally {
    loading.value = false;
  }
};
</script>
