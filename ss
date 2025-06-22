[33mcommit 2b1f5daa215ea7e14ff115d71cb6f8584d9e15aa[m[33m ([m[1;36mHEAD[m[33m -> [m[1;32mFeat/Login[m[33m, [m[1;31morigin/Feat/Login[m[33m)[m
Author: patrickfernandesconceicao <patrickfernandesconceicao@gmail.com>
Date:   Fri May 9 02:12:50 2025 -0300

    fix : login conectando backend com frontend porém falta linkar no layout

[33mcommit 05de5f3162370beae1217f6dc3a1d268263ed41b[m
Author: patrickfernandesconceicao <patrickfernandesconceicao@gmail.com>
Date:   Fri May 9 00:49:43 2025 -0300

    Test

[33mcommit dd0057be22c2b3c0c3a21527d66d5269e6d69388[m
Merge: fd67d95 571f2be
Author: patrickfernandesconceicao <patrickfernandesconceicao@gmail.com>
Date:   Fri May 9 00:25:06 2025 -0300

    Fix : UsuarioRepository

[33mcommit fd67d95880892028af33627fbc576c5b64ea3081[m
Author: patrickfernandesconceicao <patrickfernandesconceicao@gmail.com>
Date:   Fri May 9 00:21:59 2025 -0300

    feat : api base de login

[33mcommit 571f2bedd9d4b2cb6dbc7237a4d24e54bac6e68e[m[33m ([m[1;31morigin/main[m[33m)[m
Author: Matheus <mf5881585@gmail.com>
Date:   Mon Apr 28 20:07:55 2025 -0300

    feat: add Monitorias and Relatorios pages with filtering and visualization features

[33mcommit bef74d3c962cf720bd9a40fcec7b2f4b4a11a0a0[m
Author: Matheus <mf5881585@gmail.com>
Date:   Mon Apr 28 17:38:51 2025 -0300

    feat: replace toast notifications with Sonner for project submission feedback

[33mcommit 0358f72146a442828c299fc61268a14a9b535549[m
Author: Matheus <mf5881585@gmail.com>
Date:   Mon Apr 28 17:38:04 2025 -0300

    feat: add sidebar component with user role-based navigation
    
    - Implemented Sidebar component with routes for Dashboard, Projects, Events, Monitoring, and Reports.
    - Added admin routes for Users and Settings, visible only to ADMIN and COORDENADOR roles.
    - Integrated user avatar and logout button in the sidebar.
    
    feat: create mode toggle component for theme switching
    
    - Developed ModeToggle component to switch between light, dark, and system themes.
    - Utilized DropdownMenu for theme selection.
    
    feat: implement theme provider for managing application theme
    
    - Created ThemeProvider to manage theme state and persist user preferences in local storage.
    - Added utility functions for theme management.
    
    fix: update Sonner component to support theme changes
    
    - Adjusted Toaster component to reflect current theme using next-themes.
    
    feat: add textarea component for user input
    
    - Introduced Textarea component with customizable styles.
    
    feat: enhance utility functions for date and currency formatting
    
    - Added utility functions for formatting dates, currencies, truncating text, generating IDs, and validating emails.
    
    style: add global styles for dark and light themes
    
    - Created globals.css to define theme variables and apply base styles across the application.
    
    chore: update tsconfig for improved module resolution
    
    - Modified tsconfig.json to set baseUrl for easier imports.

[33mcommit e1c13c038e2927906dc6f610494c0739e9aa816e[m
Author: Matheus <mf5881585@gmail.com>
Date:   Mon Apr 28 17:10:04 2025 -0300

    feat: add UI components for popover, select, separator, sheet, sonner, switch, table, tabs, tooltip
    
    - Implemented Popover component with trigger, content, and anchor.
    - Created Select component with various subcomponents including trigger, content, item, and scroll buttons.
    - Added Separator component for visual separation in UI.
    - Developed Sheet component for modal-like functionality with header, footer, and close button.
    - Integrated Sonner for toast notifications.
    - Built Switch component for toggle functionality.
    - Established Table component with header, body, footer, and cell structures.
    - Introduced Tabs component with list, trigger, and content for tabbed navigation.
    - Created Tooltip component for displaying additional information on hover.
    - Added utility function for class name merging.
    - Included global CSS styles for theming and layout.
    - Configured TypeScript settings for the project.
    - Added SVG icons for file, globe, next, vercel, and window.

[33mcommit 767437889e81f171cfc0f86578d64a9e049cd9b1[m[33m ([m[1;32mmain[m[33m)[m
Author: patrickfernandesconceicao <patrickfernandesconceicao@gmail.com>
Date:   Mon Apr 28 08:24:25 2025 -0300

    Feature - Login

[33mcommit 67eec4ab53f661f13d72e89d652354c947a3d6b0[m
Author: patrickfernandesconceicao <patrickfernandesconceicao@gmail.com>
Date:   Mon Apr 14 23:29:42 2025 -0300

    System Pattern

[33mcommit 00e494cb0049ff6288e4abe98af94efc87f28ade[m
Author: patrickfernandesconceicao <patrickfernandesconceicao@gmail.com>
Date:   Mon Apr 14 21:59:43 2025 -0300

    first commit
