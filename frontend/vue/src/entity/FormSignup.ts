import Observable from "../observer/Observable";

// Model - Representação do estado da View em memória
export default class FormSignup extends Observable {
    isPassenger = false;
    name = "";
    email = "";
    cpf = "";
    password = "";
    confirmPassword = "";
    step = 1;
    error = "";
    success = "";

    constructor () {
        super();
    }

    calculateProgress () {
		let progress = 0
		if (this.isPassenger) progress += 25;
		if (this.name) progress += 20;
		if (this.email) progress += 20;
		if (this.cpf) progress += 20;
		if (this.password && this.confirmPassword && this.password === this.confirmPassword) progress += 15;
		return progress;
	}

	validate () {
		this.error = "";
		if (this.step === 1 && !this.isPassenger) {
			this.error = "Selecione o tipo de conta";
			return false;
		}
		if (this.step === 2) {
			if (!this.name) {
				this.error = "Preencha o nome";
				return false;
			}
			if (!this.email) {
				this.error = "Preencha o email";
				return false;
			}
			if (!this.cpf) {
				this.error = "Preencha o cpf";
				return false;
			}
		}
		if (this.step === 3) {
			if (!this.password) {
				this.error = "Preencha a senha";
				return false;
			}
			if (!this.confirmPassword) {
				this.error = "Preencha a confirmação da senha";
				return false;
			}
			if (this.password !== this.confirmPassword) {
				this.error = "A senha e a confirmação da senha devem ser iguais";
				return false;
			}
		}
		return true;
	}

	previous () {
		this.step--;
	}

	next () {
		if (this.validate()) {
			this.step++;
		}
	}

	async confirm () {
		if(this.validate()) {
			const input = {
				name: this.name,
				email: this.email,
				cpf: this.cpf,
				password: this.password,
				isPassenger: this.isPassenger
			}
			this.notifyAll("confirmed", input);
		}
	}

	fill () {
		this.name = "John Doe";
		this.email = `john.doe${Math.random()}@gmail.com`;
		this.cpf = "97456321558";
		this.password = "123456";
		this.confirmPassword = "123456";
		this.isPassenger = true;
	}

}