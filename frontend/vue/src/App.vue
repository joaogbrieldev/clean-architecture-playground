<script setup lang="ts">
	// ViewModel - Intermediador entre View e Model, reativo bidirecional
	import { inject, ref } from 'vue';
	import AccountGateway from './gateway/AccountGateway';
	import FormSignup from './entity/FormSignup';

	const accountGateway = inject("accountGateway") as AccountGateway;
	const form = ref(new FormSignup());

	form.value.register("confirmed", async function (input: any) {
		const output = await accountGateway.signup(input);
		form.value.success = output.accountId;
	});

</script>

<template>
	<!-- View - Apresenta o estado definido no Model -->
	<div>
		<div>
			<span @click="form.fill()">Passo:</span>
			<span class="span-step">{{ form.step }}</span>
		</div>
		<div>
			<span>Progresso: </span>
			<span class="span-progress">{{ form.calculateProgress() }}%</span>
		</div>
		<div>
			<span>Successo:</span>
			<span v-if="form.success" class="span-success">{{ form.success }}</span>
		</div>
		<div>
			<span>Erro:</span>
			<span class="span-error">{{ form.error }}</span>
		</div>
	</div>
	<div v-if="form.step === 1">
		<div>
			<span>Passageiro: </span>
			<input type="checkbox" class="input-is-passenger" v-model="form.isPassenger"/>
		</div>
	</div>
	<div v-if="form.step === 2">
		<div>
			<span>Nome:</span>
			<input type="text" class="input-name" v-model="form.name"/>
		</div>
		<div>
			<span>Email:</span>
			<input type="text" class="input-email" v-model="form.email"/>
		</div>
		<div>
			<span>Cpf:</span>
			<input type="text" class="input-cpf" v-model="form.cpf"/>
		</div>
	</div>
	<div v-if="form.step === 3">
		<div>
			<span>Senha:</span>
			<input type="text" class="input-password" v-model="form.password"/>
		</div>
		<div>
			<span>Confirmação da Senha:</span>
			<input type="text" class="input-confirm-password" v-model="form.confirmPassword"/>
		</div>
	</div>
	<div>
		<button v-if="form.step > 1" class="button-previous" @click="form.previous()">Anterior</button>
		<button v-if="form.step < 3" class="button-next" @click="form.next()">Próximo</button>
		<button v-if="form.step === 3" class="button-confirm" @click="form.confirm()">Confirmar</button>
	</div>
</template>

<style>
</style>
