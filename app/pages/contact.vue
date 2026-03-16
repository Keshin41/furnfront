<script setup lang="ts">
import type { FormSubmitEvent } from '@nuxt/ui';
import * as z from 'zod'

const contactFormSchema = z.object({
	email: z.email('Adresse email invalide'),
	subject: z.string().max(128, '128 caractères maximum'),
	content: z.string().max(2048, '2048 caractères maximum'),
});

type ContactForm = z.infer<typeof contactFormSchema>;

const loading = ref(false);
const toast = useToast();

const contactFormData = reactive<ContactForm>({
	email: '',
	subject: '',
	content: '',
});

export interface ContactResponse {
	success: boolean,
	error?: string
}

function sanitizeForm(data: ContactForm): ContactForm {
	return {
		email: data.email.trim(),
		subject: data.subject.trim(),
		content: data.content.trim(),
	}
}

function isContactFormValid(): boolean {
	return contactFormSchema.safeParse(contactFormData).success;
}

function resetContactForm(): void {
	contactFormData.email = '';
	contactFormData.subject = '';
	contactFormData.content = '';
}

async function sendContactForm(data: ContactForm) {
	return await $fetch<ContactResponse>('/contact', {
		method: 'POST',
		body: data,
	});
}

async function onSubmit(event: FormSubmitEvent<ContactForm>): Promise<void> {
	if (loading.value) return;

	loading.value = true;
	console.log(sanitizeForm(event.data));
	try {
		await sendContactForm(sanitizeForm(event.data));
		toast.add({
			title: 'Demande envoyée',
			description: 'Vous receverez une réponse dans les plus brefs délais.',
			color: 'success',
		})
		resetContactForm()
	} finally {
		loading.value = false;
	}
}

</script>

<template>
	<UForm :schema="contactFormSchema" :state="contactFormData" @submit="onSubmit">
		<UFormField label="Email">
			<UInput
				v-model="contactFormData.email"
				name="email"
				type="email"
				placeholder="jean.dupont@exemple.com"
				required
			/>
		</UFormField>
		<UFormField label="Subject">
			<UInput
				v-model="contactFormData.subject"
				name="subject"
				type="text"
				placeholder="Entrez l'objet de votre demande"
				required
			/>
		</UFormField>
		<UTextarea
			v-model="contactFormData.content"
			name="content"
			placeholder="Écrivez votre message ici"
			:rows="5"
			required
		/>
		<UButton type="submit" :loading="loading" :disabled="loading || !isContactFormValid">
			Enregistrer
		</UButton>
	</UForm>
</template>