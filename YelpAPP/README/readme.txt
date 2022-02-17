********************************************************************************
FLASH

for flash you need to :
- install it - npm i connect-flash
- const flash = require('connect-flash')
- define middleware for flash so it can pe used
  app.use((req , res , next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error")
    next()
  })
- in the route you need it you call for it
- in layouts/ boilerplate -  include the flash where you like