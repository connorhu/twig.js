
class Twig_Environment
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
        console.error('function '+ arguments.callee.name +' unimplemented')
    }

    setBaseTemplateClass(baseClass) {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    enableDebug() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    disableDebug() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    isDebug() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    enableAutoReload() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    disableAutoReload() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    isAutoReload() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    enableStrictVariables() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    disableStrictVariables() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    isStrictVariables() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    getCache() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    setCache() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    getTemplateClass() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    render() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    display() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    load() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    loadTemplate() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    createTemplate() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    isTemplateFresh() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    resolveTemplate() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    setLexer() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    tokenize() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    setParser() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    parse() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    setCompiler() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    compile() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    compileSource() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    setLoader() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    getLoader() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    setCharset() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    getCharset() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    hasExtension() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    addRuntimeLoader() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    getExtension() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    getRuntime() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    addExtension() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    setExtensions() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    getExtensions() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    addTokenParser() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    getTokenParsers() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    getTags() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    addNodeVisitor() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    getNodeVisitors() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    addFilter() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    getFilter() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    registerUndefinedFilterCallback() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    getFilters() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    addTest() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    getTests() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    getTest() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    addFunction() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    getFunction() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    registerUndefinedFunctionCallback() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    getFunctions() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    addGlobal() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    getGlobals() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    mergeGlobals() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    getUnaryOperators() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    getBinaryOperators() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    updateOptionsHash() {
        console.error('function '+ arguments.callee.name +' unimplemented')
    }
    
    
    
}