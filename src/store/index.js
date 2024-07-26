import { defineStore } from "pinia";

export const iconChoiceStore = defineStore('iconChoice', {
    state: () => {
        return {
            name: '',
        }
    },

    getters: {

    },

    actions: {
        setIconName(name) {
            this.name = name
        }
    }
})