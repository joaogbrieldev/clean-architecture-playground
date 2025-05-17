import { mount, VueWrapper } from "@vue/test-utils";
import App from "../src/App.vue";
import { AccountGatewayHttp, AccountGatewayMemory } from "../src/gateway/AccountGateway";
import { AxiosAdapter, FetchAdapter } from "../src/http/HttpClient";

let wrapper: VueWrapper;

beforeEach(() => {
    // const accountGateway = new AccountGatewayMemory();
    const accountGateway = new AccountGatewayHttp(new FetchAdapter());
    wrapper = mount(App, {
        global: {
            provide: {
                accountGateway
            }
        }
    });
});

function sleep (time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    })
}

test("Deve testar o fluxo de progresso no preenchimento do wizard", async function () {
    expect(wrapper.get(".span-progress").text()).toBe("0%");
    expect(wrapper.get(".span-step").text()).toBe("1");
    await wrapper.get(".input-is-passenger").setValue(true);
    expect(wrapper.get(".span-progress").text()).toBe("25%");
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".span-step").text()).toBe("2");
    await wrapper.get(".input-name").setValue("John Doe");
    expect(wrapper.get(".span-progress").text()).toBe("45%");
    await wrapper.get(".input-email").setValue(`john.doe${Math.random()}@gmail.com`);
    expect(wrapper.get(".span-progress").text()).toBe("65%");
    await wrapper.get(".input-cpf").setValue("97456321558");
    expect(wrapper.get(".span-progress").text()).toBe("85%");
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".span-step").text()).toBe("3");
    await wrapper.get(".input-password").setValue("123456");
    expect(wrapper.get(".span-progress").text()).toBe("85%");
    await wrapper.get(".input-confirm-password").setValue("123");
    expect(wrapper.get(".span-progress").text()).toBe("85%");
    await wrapper.get(".input-confirm-password").setValue("123456");
    expect(wrapper.get(".span-progress").text()).toBe("100%");
    await wrapper.get(".button-previous").trigger("click");
    expect(wrapper.get(".span-step").text()).toBe("2");
    await wrapper.get(".button-previous").trigger("click");
    expect(wrapper.get(".span-step").text()).toBe("1");
});

test("Deve testar a visibilidade dos componentes do wizard", async function () {
    expect(wrapper.find(".input-is-passenger").exists()).toBe(true);
    expect(wrapper.find(".input-name").exists()).toBe(false);
    expect(wrapper.find(".input-email").exists()).toBe(false);
    expect(wrapper.find(".input-cpf").exists()).toBe(false);
    expect(wrapper.find(".input-password").exists()).toBe(false);
    expect(wrapper.find(".input-confirm-password").exists()).toBe(false);
    expect(wrapper.find(".button-previous").exists()).toBe(false);
    expect(wrapper.find(".button-next").exists()).toBe(true);
    await wrapper.get(".input-is-passenger").setValue(true);
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.find(".input-is-passenger").exists()).toBe(false);
    expect(wrapper.find(".input-name").exists()).toBe(true);
    expect(wrapper.find(".input-email").exists()).toBe(true);
    expect(wrapper.find(".input-cpf").exists()).toBe(true);
    expect(wrapper.find(".input-password").exists()).toBe(false);
    expect(wrapper.find(".input-confirm-password").exists()).toBe(false);
    expect(wrapper.find(".button-previous").exists()).toBe(true);
    expect(wrapper.find(".button-next").exists()).toBe(true);
    await wrapper.get(".input-name").setValue("John Doe");
    await wrapper.get(".input-email").setValue(`john.doe${Math.random()}@gmail.com`);
    await wrapper.get(".input-cpf").setValue("97456321558");
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.find(".input-is-passenger").exists()).toBe(false);
    expect(wrapper.find(".input-name").exists()).toBe(false);
    expect(wrapper.find(".input-email").exists()).toBe(false);
    expect(wrapper.find(".input-cpf").exists()).toBe(false);
    expect(wrapper.find(".input-password").exists()).toBe(true);
    expect(wrapper.find(".input-confirm-password").exists()).toBe(true);
    expect(wrapper.find(".button-previous").exists()).toBe(true);
    expect(wrapper.find(".button-next").exists()).toBe(false);
});

test("Deve testar a validação dos campos e o controle do preenchimento do wizard", async function () {
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".span-step").text()).toBe("1");
    expect(wrapper.get(".span-error").text()).toBe("Selecione o tipo de conta");
    await wrapper.get(".input-is-passenger").setValue(true);
    await wrapper.get(".button-next").trigger("click");
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".span-step").text()).toBe("2");
    expect(wrapper.get(".span-error").text()).toBe("Preencha o nome");
    await wrapper.get(".input-name").setValue("John Doe");
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".span-error").text()).toBe("Preencha o email");
    expect(wrapper.get(".span-step").text()).toBe("2");
    await wrapper.get(".input-email").setValue(`john.doe${Math.random()}@gmail.com`);
    await wrapper.get(".button-next").trigger("click");
    expect(wrapper.get(".span-error").text()).toBe("Preencha o cpf");
    expect(wrapper.get(".span-step").text()).toBe("2");
    await wrapper.get(".input-cpf").setValue("97456321558");
    await wrapper.get(".button-next").trigger("click");
    await wrapper.get(".button-confirm").trigger("click");
    expect(wrapper.get(".span-error").text()).toBe("Preencha a senha");
    await wrapper.get(".input-password").setValue("123456");
    await wrapper.get(".button-confirm").trigger("click");
    expect(wrapper.get(".span-error").text()).toBe("Preencha a confirmação da senha");
    await wrapper.get(".input-confirm-password").setValue("1234");
    await wrapper.get(".button-confirm").trigger("click");
    expect(wrapper.get(".span-error").text()).toBe("A senha e a confirmação da senha devem ser iguais");
    await wrapper.get(".input-confirm-password").setValue("123456");
    await wrapper.get(".button-confirm").trigger("click");
    expect(wrapper.get(".span-error").text()).toBe("");
});

test("Deve testar o fluxo de criação integrando com o backend", async function () {
    await wrapper.get(".input-is-passenger").setValue(true);
    await wrapper.get(".button-next").trigger("click");
    await wrapper.get(".input-name").setValue("John Doe");
    await wrapper.get(".input-email").setValue(`john.doe${Math.random()}@gmail.com`);
    await wrapper.get(".input-cpf").setValue("97456321558");
    await wrapper.get(".button-next").trigger("click");
    await wrapper.get(".input-password").setValue("123456");
    await wrapper.get(".input-confirm-password").setValue("123456");
    await wrapper.get(".button-confirm").trigger("click");
    await sleep(200);
    expect(wrapper.find(".span-success").exists()).toBe(true);
});
