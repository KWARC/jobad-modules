# Official JOBAD Modules Repository

This repository contains the  [JOBAD](https://github.com/KWARC/jobad) Modules repository. For all information regarding JOBAD, please check the JOBAD Documentation at [http://kwarc.github.io/jobad/stable](http://kwarc.github.io/jobad/stable). 

## Contributing Modules

You can contribute your own JOBAD modules here. For an introduction to writing JOBAD Modules, please see [http://kwarc.github.io/jobad/stable/doc/html/intro/modules.html](http://kwarc.github.io/jobad/stable/doc/html/intro/modules.html). To add your own module, please: 

* Fork this repository
* Create your own subfolder in which you can put your own modules
* add a README in that subfolder
* add your modules in that subfolder
* add your modules in `jobad_repo.js`, remember to put them into "provides" (array of your module identifiers) and "at" (identifier -> location of module map). 
* make a pull request

Please also make sure that

* all your modules have (useful) `author`, `title` and `description` information. 
* your modules have unique identifiers, preferably all in the same namespace (you could use your name)
    * do not use the namespace "jobad"
* if you want to add icons, use `JOBAD.resources.provide` and best give them in the data uri scheme
* you do not change other peoples modules

## Repository access
The repository is available at [http://kwarc.github.io/jobad-modules/](http://kwarc.github.io/jobad-modules/). For a list of all currently available modules, please check there. 

To load modules from this repository with JOBAD, use

```js
JOBAD.repo.loadFrom("http://kwarc.github.io/jobad-modules/", ["template"], function(suc, msg){
    if(suc){
        //modules loaded
    } else {
        //errror, msg will contain a message
    }
})
```

## License

This repository is licensed the same way as JOBAD: 

    Copyright (C) 2013 KWARC Group <kwarc.info>
        
    JOBAD is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    JOBAD is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with JOBAD.  If not, see <http://www.gnu.org/licenses/>.
