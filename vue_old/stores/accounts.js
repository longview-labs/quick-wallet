import { defineStore } from 'pinia';

import { generateAccount } from '../../core/accounts';

// You can name the return value of `defineStore()` anything you want,
// but it's best to use the name of the store and surround it with `use`
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    creating: false,
    account: null,
  }),
  getters: {
    activeAccount(state) {
      return state.account;
    },
    hasAccounts(state) {
      return state.account !== null;
    },
  },
  actions: {
    // setActiveAccountBackedup(backedup) {
    //   if (!this.active) return;

    //   const index = this.accounts.findIndex((a) => a.address === this.active);
    //   if (index >= 0) {
    //     const newAccountObj = { ...this.accounts[index], backedup };
    //     this.accounts.splice(index, 1, newAccountObj);
    //     setAccounts(this.accounts);
    //   }
    // },
    async createAccount() {
      this.creating = true;
      const newAccounts = await generateAccount();
      this.accounts = this.accounts.concat(newAccounts);
      this.creating = true;
      return newAccounts;
    },
    loginAccount() {
      const account = this.accounts[0];
      if (account) {
        this.active = account.address;
      }
    }
  },
})