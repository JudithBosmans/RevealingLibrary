<template>
  <nav class="nav">
    <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
      <img
        src="/public/assets/nav/navGif.gif"
        class="navIcon"
        alt="Bibliotheek Sint-Lukas Brussel Logo"
      />
    </a>
    <div
      class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse"
    >
      <a href="/Profile/page" class="navProfile">
        <img src="/public/assets/placeholderProfile.jpeg" alt="user photo" />
      </a>
    </div>

    <div class="md:flex md:w-auto md:order-1 nav navItems" id="navbar-user">
      <ul>
        <li>
          <a href="/Categories/page" aria-current="page">Categorieën</a>
        </li>
        <li>
          <a
            href="#"
            class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >Boeken</a
          >
        </li>
        <li>
          <a
            href="#"
            class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >Evenementen</a
          >
        </li>
        <li>
          <a
            href="#"
            class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >Locatie</a
          >
        </li>
        <li>
          <a
            href="#"
            class="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >Contact</a
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script></script>
