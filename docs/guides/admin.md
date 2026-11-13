# Using the admin

Open `/admin` on the site and sign in with your work email. What you see depends on your role; ask the owner if something is missing.

## Products

**Products** lists everything, newest change first. Search by name, web address or SKU. Press a product's name to edit it.

- **Details**: the name, web address, short description, brand, description and category. Tick **Show on the shop** to publish it.
- **Prices and stock**: one row per option. Prices are in pounds and include VAT; leave a price empty if that option isn't for sale yet. **In stock** is how many are in the yard; **Covers** is the square metres in one pack, which gives the price per m² on the site.
- **Stock**: _Stocked only_ stops selling when the yard runs out. _Stocked, then made to order_ keeps selling and tells the customer how many come now and how many are made. _Made to order_ is always available. Anything made to order needs a lead time.
- **Photos**: add one at a time (JPEG, PNG or WebP up to 10 MB) with a description of what it shows. Tick **Remove** to take one off. The first photo leads on the site.
- **How it sells**: the page type, and for 1B products the colour set and when it shows (for example _Finish is Powder coated_).

Press **Save**. If something needs fixing first, it is listed at the top and nothing changes. The site shows the change within a moment.

New products start hidden. Use **Add product** on the products page, fill it in, then tick **Show on the shop**.

## Orders

Newest first, with the delivery day and whether it is booked. Open one for the address, what they bought (with what ships now and what is made to order), the lorry access answers and the payment. **Refund** sends money back the way they paid. Test payments show as such.

A day marked **call to rebook** means the customer's hold ran out and the day filled up while they paid: call them to agree another day.

## Delivery

Each zone has its postcode areas, its rates and how many pallets a day it takes. Rates are one per line: `pallet, 1000, 65.00` means pallets up to 1000 kg cost £65.00. The zone page shows the next four weeks with how many days are booked, held at checkout and free.

## Change log and undo

Every change by anyone, newest first. **Put back as before** undoes that one change (and is logged too). It works for products, colour sets, delivery zones, content and staff accounts.

## SKU checks

Every option needs its own SKU, colours from a colour set never make a SKU, and product codes stay out of names. Fix what's listed from each product's page.

## Staff (owner only)

Add people with a role and a starting password, change roles, reset passwords, or untick **Can sign in** when someone leaves. There is always at least one owner. If someone loses the phone with their authenticator app, tick **Turn off two-factor (lost phone)** on their row, then ask them to set it up again.

## Your account (everyone)

Click your name at the top of the admin or the content editor.

- **Change your password:** enter the current one and the new one twice.
- **Two-factor sign-in:** click **Set up two-factor**, add the key shown to an authenticator app on your phone (Google Authenticator, Microsoft Authenticator or 1Password), then enter the 6-digit code the app shows. From then on, signing in asks for a code after your password. Everyone with the owner role should turn it on.
