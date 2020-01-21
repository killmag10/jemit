MAKEFLAGS += -rR --no-print-directory --warn-undefined-variables

NPM := npm
NPX := npx
RM := rm
TEST := test
GREP := grep
FIND := find

TEST_DIRS := tests/integration tests/unit
TEST_FILES := $(shell $(FIND) $(TEST_DIRS) -type f -name '*.js')
PATH_NODE_MODULES := node_modules
PATH_DOCS := docs

.PHONY: \
	install \
	uninstall \
	test \
	test-coverage \
	test-coverage-open \
	$(TEST_FILES) \
	lint \
	api-doc \
	api-doc-open \
	clean \
	clean-html

install:
	# Install node modules.
	@$(NPM) install

uninstall:
	# Remove node modules.
	@$(TEST) ! -d node_modules/ || $(RM) -r node_modules/

test:
	$(NPX) mocha --recursive $(TEST_DIRS)

test-coverage:
	$(NPX) nyc $(MAKE) test

test-coverage-open:
	xdg-open $(PATH_DOCS)/html/coverage/index.html

$(TEST_FILES):
	$(NPX) mocha \
		$@

lint:
	$(NPX) eslint .

lint-fix:
	$(NPX) eslint --fix .

api-doc:
	# Create html docs under docs/html/api
	$(NPX) jsdoc \
		--template $(PATH_NODE_MODULES)/ink-docstrap/template \
		--destination $(PATH_DOCS)/html/api \
		--recurse \
		lib/

api-doc-open:
	xdg-open $(PATH_DOCS)/html/api/index.html

clean: clean-html

clean-html:
	# Remove html docs
	@$(TEST) ! -d $(PATH_DOCS)/html || $(RM) -r $(PATH_DOCS)/html
