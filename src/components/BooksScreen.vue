<script setup lang="ts">
import type { Book } from '@/types/vocab';

defineProps<{
	books: Book[];
}>();

defineEmits<{
	open: [bookId: string];
}>();
</script>

<template>
	<div class="flex flex-col gap-4 py-4">
		<!-- Sarlavha -->
		<div class="text-center mb-2">
			<h1 class="text-2xl font-bold text-gray-900 mb-1">Kitoblar</h1>
			<p class="text-sm text-gray-500">O'rganmoqchi bo'lgan kitobni tanlang</p>
		</div>

		<!-- Kitoblar grid -->
		<div class="grid grid-cols-2 gap-3">
			<button
				v-for="book in books"
				:key="book.id"
				:disabled="!book.available"
				:class="[
					'group flex flex-col rounded-xl border bg-white overflow-hidden text-left transition-transform dark:bg-neutral-800 dark:border-neutral-700',
					book.available
						? 'cursor-pointer border-stone-200 active:scale-[0.97] hover:shadow-md'
						: 'cursor-not-allowed border-stone-200 opacity-60',
				]"
				@click="book.available && $emit('open', book.id)"
			>
				<!-- Kitob muqovasi -->
				<div
					class="relative aspect-[3/4] w-full bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/20 overflow-hidden"
				>
					<img
						:src="book.coverImage"
						:alt="book.titleUz"
						class="w-full h-full object-cover"
						loading="lazy"
						@error="($event.target as HTMLImageElement).style.display = 'none'"
					/>
					<!-- Disabled overlay -->
					<div
						v-if="!book.available"
						class="absolute inset-0 flex items-center justify-center bg-black/30"
					>
						<span class="text-3xl">🔒</span>
					</div>
				</div>

				<!-- Ma'lumotlar -->
				<div class="p-3 flex-1 flex flex-col">
					<div
						class="arabic-text text-base text-emerald-700 dark:text-emerald-400 mb-0.5"
					>
						{{ book.titleAr }}
					</div>
					<div
						class="font-semibold text-sm text-gray-900 dark:text-neutral-100 mb-1"
					>
						{{ book.titleUz }}
					</div>
					<div class="text-xs text-gray-500 dark:text-neutral-400 mb-2">
						<template v-if="book.available">
							{{ book.level }} · {{ book.lessonsCount }} dars
						</template>
						<template v-else>
							<span class="text-amber-600 dark:text-amber-400 font-medium">
								⏳ Tez orada
							</span>
						</template>
					</div>
					<p
						class="text-xs text-gray-600 dark:text-neutral-300 line-clamp-2 mt-auto"
					>
						{{ book.description }}
					</p>
				</div>
			</button>
		</div>
	</div>
</template>
