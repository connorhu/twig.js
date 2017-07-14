'use strict';

function __function()
{
    var e = new Error()
    
    return e.stack.split("\n")[2].trim().split(' ')[1]
}


import Twig_ExtensionSet from './ExtensionSet.js'
import Twig_TemplateWrapper from './TemplateWrapper.js'
import Twig_Template from './Template.js'

import Twig_Extension_Core from './Extension/Core.js'
import Twig_Extension_Escaper from './Extension/Escaper.js'
import Twig_Extension_Optimizer from './Extension/Optimizer.js'

export default class Twig_Environment
{
    constructor(loader, options = null) {
        this.setLoader(loader)

        this.debug = options.debug !== undefined ? options.debug : false
        this.charset = options.charset !== undefined ? options.charset : 'UTF-8'
        this.baseTemplateClass = options.base_template_class !== undefined ? options.base_template_class : 'Twig_Template'
        this.autoReload = options.auto_reload !== undefined ? options.auto_reload : options.debug
        this.strictVariables = options.strict_variables !== undefined ? options.strict_variables : false
        this.cache = options.cache !== undefined ? options.cache : false
        this.extensionSet = new Twig_ExtensionSet()

        this.addExtension(new Twig_Extension_Core())
        this.addExtension(new Twig_Extension_Escaper(options.autoescape))
        this.addExtension(new Twig_Extension_Optimizer(options.optimizations))
    }
    
    getBaseTemplateClass() {
        console.error('function '+ __function() +' unimplemented')
    }

    setBaseTemplateClass(baseClass) {
        console.error('function '+ __function() +' unimplemented')
    }
    
    enableDebug() {
        this.debug = true
        this.updateOptionsHash()
    }
    
    disableDebug() {
        this.debug = false
        this.updateOptionsHash()
    }
    
    isDebug() {
        return this.debug
    }
    
    enableAutoReload() {
        this.autoReload = true
    }
    
    disableAutoReload() {
        this.autoReload = false
    }
    
    isAutoReload() {
        return this.autoReload
    }
    
    enableStrictVariables() {
        this.strictVariables = true
        this.updateOptionsHash()
    }
    
    disableStrictVariables() {
        this.strictVariables = false
        this.updateOptionsHash()
    }
    
    isStrictVariables() {
        return this.strictVariables
    }
    
    getCache(original = true) {
        return original ? this.originalCache : this.cache
    }
    
    setCache(cache) {
        console.error('function '+ __function() +' unimplemented')
    }
    
    getTemplateClass(name, index = null) {
        console.error('function '+ __function() +' unimplemented')
        
        this.getLoader().getCacheKey(name) + this.optionsHash

        // public function getTemplateClass($name, $index = null)
        // {
        //     $key = $this->getLoader()->getCacheKey($name).$this->optionsHash;
        //
        //     return $this->templateClassPrefix.hash('sha256', $key).(null === $index ? '' : '_'.$index);
        // }

    }
    
    render() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    display() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    load(name) {
        if (name instanceof Twig_TemplateWrapper) {
            return name;
        }

        if (name instanceof Twig_Template) {
            return new Twig_TemplateWrapper(this, name);
        }

        return new Twig_TemplateWrapper(this, this.loadTemplate(name));
    }
    
    loadTemplate(name, index = null) {
        console.error('function '+ __function() +' unimplemented')

        let cls, mainCls = this.getTemplateClass(name)

        // $cls = $mainCls = $this->getTemplateClass($name);
        // if (null !== $index) {
        //     $cls .= '_'.$index;
        // }
        //
        // if (isset($this->loadedTemplates[$cls])) {
        //     return $this->loadedTemplates[$cls];
        // }
        //
        // if (!class_exists($cls, false)) {
        //     $key = $this->cache->generateKey($name, $mainCls);
        //
        //     if (!$this->isAutoReload() || $this->isTemplateFresh($name, $this->cache->getTimestamp($key))) {
        //         $this->cache->load($key);
        //     }
        //
        //     if (!class_exists($cls, false)) {
        //         $source = $this->getLoader()->getSourceContext($name);
        //         $content = $this->compileSource($source);
        //         $this->cache->write($key, $content);
        //         $this->cache->load($key);
        //
        //         if (!class_exists($mainCls, false)) {
        //             /* Last line of defense if either $this->bcWriteCacheFile was used,
        //              * $this->cache is implemented as a no-op or we have a race condition
        //              * where the cache was cleared between the above calls to write to and load from
        //              * the cache.
        //              */
        //             eval('?>'.$content);
        //         }
        //
        //         if (!class_exists($cls, false)) {
        //             throw new Twig_Error_Runtime(sprintf('Failed to load Twig template "%s", index "%s": cache is corrupted.', $name, $index), -1, $source);
        //         }
        //     }
        // }
        //
        // // to be removed in 3.0
        // $this->extensionSet->initRuntime($this);
        //
        // return $this->loadedTemplates[$cls] = new $cls($this);
    }
    
    createTemplate() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    isTemplateFresh() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    resolveTemplate() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    setLexer() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    tokenize() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    setParser() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    parse() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    setCompiler() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    compile() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    compileSource() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    setLoader(loader) {
        this.loader = loader
    }
    
    getLoader() {
        return this.loader
    }
    
    setCharset(charset) {
        this.charset = charset
    }
    
    getCharset() {
        return this.charset
    }
    
    hasExtension() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    addRuntimeLoader() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    getExtension() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    getRuntime() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    addExtension() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    setExtensions() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    getExtensions() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    addTokenParser() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    getTokenParsers() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    getTags() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    addNodeVisitor() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    getNodeVisitors() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    addFilter() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    getFilter() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    registerUndefinedFilterCallback() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    getFilters() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    addTest() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    getTests() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    getTest() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    addFunction() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    getFunction() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    registerUndefinedFunctionCallback() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    getFunctions() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    addGlobal() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    getGlobals() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    mergeGlobals() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    getUnaryOperators() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    getBinaryOperators() {
        console.error('function '+ __function() +' unimplemented')
    }
    
    updateOptionsHash() {
        this.optionsHash = [
            this.extensionSet.getSignature(),
            PHP_MAJOR_VERSION,
            PHP_MINOR_VERSION,
            this.version,
            this.debug * 1,
            this.baseTemplateClass,
            this.strictVariables * 1
        ].join(':')
    }
    
    
    
}