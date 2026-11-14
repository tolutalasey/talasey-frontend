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

## Made-to-measure pricing (page type 2)

On a made-to-measure product, click **Made-to-measure sizes, price formula and test calculator**.

- **Sizes:** tick each size the customer types in (width, height, depth, length) and set the smallest, the largest and the steps (1 means any whole number).
- **Choices:** one per line, like `Finish (FIN): Mild steel = 1, Corten = 2, Powder coated = 3`. The short name in brackets is what the formula uses; each answer gives it a number.
- **Formula:** the price in pounds including VAT. Work in steps, one per line, ending each with `;`, for example `AREA = W * D / 1000000;`. The last line is the price. You can use `min`, `max` and `if(test, then, otherwise)`.
- **Test calculator:** type a size, pick the choices and click **Work out a test price**. It uses what is on the page, saved or not, exactly as the shop and the basket will. Check it against the technical team's worked examples before saving.
- **Save pricing** checks the formula first. If something is wrong, for example a name the formula doesn't know, it says what and saves nothing.

## Import and export

- **Download as Excel** gives every product option with its SKU, price, stock, stock mode, lead time, weight, coverage and barcode, one row each.
- **Update from the product master sheet:** choose the sheet and click **Check what would change**. The report lists what would be added and updated, and every row that can't be imported yet with the reason (no SKU, a duplicate, no price). Nothing changes until you click **Import**. Products are matched by their web address or any of their SKUs; new ones arrive unpublished, and a price left blank in the sheet never clears one set here. Every change goes into the change log, so it can be undone.

## Samples

**Samples** in the admin lists the requests waiting to be posted, newest first, with what to send and where. Post them, then click **Mark as sent**: the customer gets an email to say they are on their way. Requests are numbered S1, S2 and so on, and the customer sees that number.

Under **Samples we offer**, add a sample by the product's web address and a name for the sample, usually the colour ("Buff"). It shows straight away on that product's page and on the **Free samples** page. **Stop offering** hides one without losing it; **Remove** deletes it. Customers choose up to five, and the wording of both emails is under **Email wording** in the content editor.

## Promotions

**Promotions** lists every promotion with its code, what it gives, how often it has been used and whether it is running now. To add one, fill in **Add a promotion**:

- **Code**: what shoppers type on the basket. Leave it blank and the promotion applies by itself to every basket that qualifies, so use that for site-wide sales.
- **What they get**: a percentage off products, pounds off products, or free delivery. Discounts never apply to delivery charges.
- **Minimum spend**, **Times it can be used**, **Starts** and **Ends** are all optional. Times are UK time.

Shoppers get the single best money-off promotion they qualify for; free delivery can come on top. Untick **Switched on** to pause one without losing it. Open **Change** under the list to edit or remove a promotion. Orders show the discount and which promotion gave it.

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
